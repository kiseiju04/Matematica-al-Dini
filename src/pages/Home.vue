<script setup>
import {signIn, loggedIn} from "@/Composables/Informations";
</script>

<template>
  <div class="page">
    <template v-if="!loggedIn">
      <button class="link" style="background: none; color: white;" @click="signIn">LOGIN</button>
    </template>
    <template v-else>
      <div class="element">
        <p>Cerchi esami e soluzioni?</p>
        <router-link class="link exams-cl" to="/courses/exams">VAI</router-link>
      </div>
      <div class="element">
        <p>Cerchi degli appunti?</p>
        <router-link to="/courses/notes" class="link notes-cl" disabled>VAI</router-link>
      </div>
      <div class="element">
        <p>Condividi Appunti o esami</p>
        <router-link to="/share" class="link share-cl">VAI</router-link>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  height: 60%;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  font-size: 1.75em;
}

.element {
  p {
    margin-bottom: 0.3em;
  }
}

.link {
  margin-top: 2em;
  padding: 0.3em 1.3em 0.1em;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 50px;
}
</style>