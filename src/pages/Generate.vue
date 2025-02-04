<script setup>
import {generatedData, getRootFolder, initGoogleDrive, loggedIn, signIn} from "@/Composables/Informations.js";
import {onMounted, ref} from "vue";

const url = ref()
const blob = ref()
const generated = ref(false)

async function generate() {
  await getRootFolder()

  let json = JSON.stringify(generatedData.value)

  blob.value = new Blob([json], { type: "application/json" });

  url.value = URL.createObjectURL(blob.value);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url.value;
  a.setAttribute("download", "dati.json");

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}

onMounted(async () => {
  await initGoogleDrive(() => {generate()})
})
</script>

<template>
  <div class="page">
    <template v-if="loggedIn">
      <button @click="signIn" class="link login">login</button>
    </template>
    <template v-else>
      <button @click="generate" class="link login">genarate</button>
    </template>
  </div>
</template>

<style scoped>
.page {
  align-items: center;
  justify-items: center;
}

.link {
  background: none;
  margin-top: 2em;
  padding: 0.3em 1.3em 0.3em;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 50px;
  color: var(--exams-cl);
}
</style>