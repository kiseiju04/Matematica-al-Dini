<script setup>
import { ref } from 'vue'

const file = ref(null)
const description = ref('')
const uploading = ref(false)
const responseMessage = ref('')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) {
    responseMessage.value = '❌ Seleziona prima un file.'
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('description', description.value)

  uploading.value = true
  responseMessage.value = ''

  try {
    const res = await fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    if (res.ok) {
      responseMessage.value = '✅ File caricato con successo!'
    } else {
      responseMessage.value = `❌ Errore: ${data.error || 'upload fallito'}`
    }
  } catch (err) {
    responseMessage.value = `❌ Errore: ${err.message}`
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="page">
    <p class="share-cl">CONDIVIDI</p>

    <p class="text">
      Clicca il bottone qui sotto per accedere a un Drive dove caricare le foto dei compiti. <br>
      Oppure usa il modulo qui sotto per caricare direttamente un file con descrizione.
    </p>

    <a target="_blank" href="https://drive.google.com/drive/folders/14HPG4wZFpvnMaM0NYyshcyBsmFjOwPBk?usp=sharing" class="link share-cl">
      VAI AL DRIVE
    </a>

    <div class="upload-form">
      <label class="custom-file">
        <input type="file" @change="handleFileChange" />
        <span>Scegli file</span>
      </label>

      <textarea v-model="description" placeholder="Scrivi una descrizione..."></textarea>

      <button class="link" @click="uploadFile" :disabled="uploading">
        {{ uploading ? 'Caricamento...' : 'Carica direttamente' }}
      </button>

      <p class="response">{{ responseMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
:root {
  --share-cl: #d1a1f6;
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  gap: 1.2em;
}

.share-cl {
  color: var(--share-cl);
  font-weight: bold;
}

.text {
  width: 100%;
  text-align: center;
  font-size: 1.1em;
}

.link {
  font-size: 1em;
  margin-top: 1em;
  padding: 0.4em 1.6em;
  text-decoration: none;
  border: 2px solid var(--share-cl);
  border-radius: 50px;
  background: none;
  color: var(--share-cl);
  cursor: pointer;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  width: 100%;
  max-width: 400px;
}

textarea {
  padding: 1em;
  width: 100%;
  color: white;
  background: none;
  border: 1px solid var(--share-cl);
  border-radius: 20px;
  font-size: 1em;
}

.custom-file {
  display: inline-block;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--share-cl);
  border-radius: 50px;
  color: var(--share-cl);
  cursor: pointer;
  padding: 0.4em 1.2em;
  font-size: 1em;
}

.custom-file input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.response {
  font-size: 0.9em;
  color: white;
  text-align: center;
}
</style>