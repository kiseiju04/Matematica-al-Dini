<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>{{ isLogin ? 'Accedi' : 'Registrati' }}</h2>
      <input v-model="username" placeholder="Nome utente" type="text" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="submit">{{ isLogin ? 'Login' : 'Signup' }}</button>
      <p class="switch" @click="isLogin = !isLogin">
        {{ isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi' }}
      </p>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import {loggedIn} from "@/Composables/Info.js";
import {username as g_username} from "@/Composables/Info.js";

const props = defineProps({
  show: Boolean,
  close: Function
})

const username = ref('')
const password = ref('')
const error = ref('')
const isLogin = ref(true)

async function submit() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Compila entrambi i campi'
    return
  }
  try {
    const endpoint = isLogin.value ? '/login' : '/signup'
    const res = await axios.post(`https://matematica-al-dini-backend.onrender.com${endpoint}`, {
      username: username.value,
      password: password.value
    })

    if (isLogin.value && res.data.authenticated === false) {
      error.value = 'Credenziali errate'
    } else if(res.status === 200) {
      save()
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Errore di rete'
  }
}

function save() {
  loggedIn.value = true
  g_username.value = username.value

  localStorage.setItem('authenticated', 'true')
  localStorage.setItem('username', username.value)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: "DkCrayonCrumble";
}

.modal {
  display: grid;
  background: black;
  color: white;
  padding: 2em;
  border-radius: 30px;
  width: 30em;
  text-align: center;
  font-family: "DkCrayonCrumble";
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.modal input {
  justify-self: center;
  display: block;
  width: 20em;
  margin: 1em 0;
  padding: 0.6em 1em;
  font-size: 1.1em;
  border-radius: 20px;
  font-family: "DkCrayonCrumble";
  background: black;
  color: var(--exams-cl);
  border: var(--exams-cl) solid 1px;
  text-align: center;
}

.modal input::placeholder {
  color: #aaa;
}

.modal button {
  background-color: black;
  color: var(--exams-cl);
  border: var(--exams-cl) solid 1px;
  padding: 0.6em 1em;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;
  width: fit-content;
  justify-self: center;
  transition: background 0.3s ease;
}

.modal button:hover {
  background-color: #eee;
}

.switch {
  margin-top: 1em;
  font-size: 1em;
  cursor: pointer;
  color: white;
  text-decoration: underline;
}

.error {
  margin-top: 1em;
  color: red;
  font-size: 1em;
}
</style>