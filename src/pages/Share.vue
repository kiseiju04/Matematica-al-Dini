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
      <input type="file" @change="handleFileChange" />
      <textarea v-model="description" placeholder="Scrivi una descrizione..."></textarea>
      <button class="link" @click="uploadFile" :disabled="uploading">
        {{ uploading ? 'Caricamento...' : 'Carica direttamente' }}
      </button>
      <p>{{ responseMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
}

.share-cl {
  color: var(--share-cl, #2196f3);
  font-weight: bold;
}

.text {
  width: 80%;
  text-align: center;
}

.link {
  font-size: 0.5em;
  margin-top: 1em;
  padding: 0.3em 1.3em 0.1em;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 50px;
  background: none;
  cursor: pointer;
}

.upload-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  width: 80%;
}

textarea {
  padding: 1em;
  width: 100%;
  color: white;
  aspect-ratio: 4 / 2;
  background: none;
  border: 1px solid var(--share-cl, #2196f3);
  border-radius: 20px;
}
</style>