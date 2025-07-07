<template>
  <div class="app">
    <login-modal v-if="login" :close="closeModal"></login-modal>
    <div v-if="animation" class="cimosa"></div>
    <div v-if="animation" class="cimosa-black"></div>
    <div class="navbar">
      <div @click="openMenu" class="menu"></div>
      <div class="h-div">
        <span class="logo"></span>
        <h1 @click="router.push('/')"> MATEMATICA al DINI</h1>
      </div>
    </div>
    <template v-if="!menu">
      <router-view v-if="loaded" :key="route.fullPath"></router-view>
    </template>
    <template v-else>
      <div class="link-list">
        <router-link class="link" @click="menu = false" to="/">HOME</router-link>
        <router-link class="link" @click="menu = false" to="/courses/exams">ESAMI</router-link>
        <router-link class="link" @click="menu = false" to="/courses/notes">APPUNTI</router-link>
        <router-link class="link" @click="menu = false" to="/share">CONDIVIDI</router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import {getRootFolder, initGoogleDrive} from "@/Composables/Informations";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {courses, notes_courses} from "@/Composables/Courses.js";
import axios from "axios";
import LoginModal from "@/components/LoginModal.vue";
import {loggedIn, login, username} from "@/Composables/Info.js";

let router = useRouter()
let route = useRoute()
let loaded = ref(false)
let menu = ref(false)
let animation = ref(false)

let backgroundOrigin = ref("")

function closeModal() {
  login.value = false
}

function openMenu() {
  animation.value = true
  setTimeout(() => {
    animation.value = false
    menu.value = !menu.value
  }, 1800)
}

function getBackground() {
  var n = Math.random() * 100
  var s = `${n}%`

  n = Math.random() * 100

  s += ` ${n}%`

  return s
}

onMounted(async () => {
  var response = await axios.get('https://matematica-al-dini-backend.onrender.com/dati')
  var data = response['data']

  loggedIn.value = localStorage.getItem('authenticated') === 'true'
  username.value = localStorage.getItem('username')

  backgroundOrigin.value = getBackground()

  courses.value = data["courses"]
  notes_courses.value = data["notes_courses"]

  loaded.value = true

  setInterval(async () => {
    var response = await axios.get('https://matematica-al-dini-backend.onrender.com/dati')
    var data = response['data']

    courses.value = data["courses"]
    notes_courses.value = data["notes_courses"]
  }, 3600 * 1000)
})
</script>

<style>
body {
  padding: 0;
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #ffffff;
}

.app {
  width: 100vw;
  height: 100vh;
  background-image: url("assets/background.jpg");
  background-size: 200vh;
  background-position: v-bind("backgroundOrigin");
  padding: 0;
  box-sizing: border-box;
  font: 1em "DkCrayonCrumble", sans-serif;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

@font-face {
  font-family: DkCrayonCrumble;
  src: url("assets/DkCrayonCrumble-ddll.ttf");
}

.navbar {
  padding: 1em 2em;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 1fr;
  grid-template-columns: 1em 1fr;
}

.menu {
  width: 1.2em;
  aspect-ratio: 1;
  background-image: url("assets/menu.svg");
  background-size: cover;
  cursor: pointer;
}

.link-list {
  margin: 1em 0;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2em;

  .link {
    font-size: 2em;
    color: white;
    text-decoration: none;
  }
}

.cimosa-black {
  position: absolute;
  z-index: 9;
  top: 3em;
  width: 100vw;
  background-image: url("assets/background.jpg");
  background-size: 200vh;
  background-position: v-bind("backgroundOrigin");
  bottom: calc(100vh - 3em);
  animation: clear-black ease-in-out 1800ms;
}

.cimosa {
  z-index: 10;
  position: absolute;
  background-image: url("./assets/cimosa.svg");
  background-size: cover;
  width: 100vw;
  aspect-ratio: 2880 / 550;
  top: 3em;
  animation: clear ease-in-out 2000ms;
}

.h-div {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 1em;

  h1 {
    font-size: 2.1em;
    margin: 0;
    cursor: pointer;
  }
}

.logo {
  display: block;
  background-image: url("./assets/logo.svg");
  background-size: cover;
  aspect-ratio: 1 / 1;
  width: 2em;
}

@keyframes clear-black {
  0% {
    bottom: calc(100vh - 3em);
  }
  100% {
    bottom: 0;
  }
}

@keyframes clear {
  0% {
    top: 3em;
  }
  100% {
    top: 100%;
  }
}

@keyframes clear-black-mobile {
  0% {
    bottom: calc(100vh - 7.5em);
  }

  20% {
    bottom: calc(80vh - 5em);
  }

  100% {
    bottom: 0;
  }
}

@media (max-width: 500px) {
  .navbar {
    padding: 1em;
  }

  .h-div {
    column-gap: 0.5em;

    h1 {
      font-size: 1.75em;
    }

    .logo {
      width: 1.75em;
    }
  }

  .cimosa-black {
    animation: clear-black-mobile ease-in-out 1800ms;
  }

  .cimosa {
    animation: clear ease-in-out 2000ms;
  }
}
</style>
