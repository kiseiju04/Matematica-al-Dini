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
    const res = await fetch('https://matematica-al-dini-backend.onrender.com/upload', {
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
    <p class="text">
      Clicca il bottone qui sotto per accedere al Drive.
    </p>

    <a class="link" target="_blank" href="https://drive.google.com/drive/folders/14HPG4wZFpvnMaM0NYyshcyBsmFjOwPBk?usp=sharing">
      VAI AL DRIVE
    </a>

    <hr class="divider" />

    <p class="text">
      Oppure carica direttamente un file con una descrizione:
    </p>

    <label class="custom-file">
      <input type="file" @change="handleFileChange" />
      <span>SCEGLI FILE</span>
    </label>

    <textarea v-model="description" placeholder="Scrivi una descrizione..."></textarea>

    <button class="upload-button" @click="uploadFile" :disabled="uploading">
      {{ uploading ? 'Caricamento...' : 'CARICA DIRETTAMENTE' }}
    </button>

    <p class="response">{{ responseMessage }}</p>
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
  height: auto;
  padding: 2em 1em;
  font-size: 1.75em;
  text-align: center;
}

.text {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1em;
}

.link,
.upload-button,
.custom-file {
  margin-top: 1em;
  padding: 0.3em 1.3em;
  text-decoration: none;
  border: 1px solid var(--share-cl);
  border-radius: 50px;
  background: none;
  color: var(--share-cl);
  font-size: 0.6em;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.custom-file {
  position: relative;
  overflow: hidden;
}

.custom-file input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

textarea {
  margin-top: 1em;
  padding: 0.8em;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 4 / 2;
  border: 1px solid var(--share-cl);
  border-radius: 20px;
  background: none;
  color: white;
  font-size: 0.6em;
  font-family: 'Courier New', monospace;
}

.response {
  margin-top: 0.5em;
  font-size: 0.5em;
  color: white;
}

.divider {
  width: 60%;
  margin: 1.5em 0 0.5em;
  border: none;
  border-top: 1px dashed var(--share-cl);
  text-align: center;
  position: relative;
}

.divider::before {
  content: 'oppure';
  position: absolute;
  top: -0.6em;
  left: 50%;
  transform: translateX(-50%);
  background: #2e2e2e;
  color: var(--share-cl);
  padding: 0 0.6em;
  font-size: 0.5em;
  font-family: 'Courier New', monospace;
}
</style>