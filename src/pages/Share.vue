<script setup>
</script>

<template>
<div class="page">
  <p class="share-cl">CONDIVIDI</p>

  <p class="text">
    clicca il bottone qui sotto per accedere ad un drive dove caricare le foto dei compiti. <br>
    se invece vuoi condividere le domande di un orale crea un nuovo file docs con le varie domande
  </p>

  <a target="_blank" href="https://drive.google.com/drive/folders/14HPG4wZFpvnMaM0NYyshcyBsmFjOwPBk?usp=sharing" class="link share-cl">CARICA</a>
</div>
</template>

<style scoped>
textarea {
  padding: 1em;
  width: 60%;
  color: white;
  aspect-ratio: 4 / 2;
  background: none;
  border: 1px solid var(--share-cl);
  border-radius: 20px;
}

.link {
  font-size: 0.5em;
  margin-top: 2em;
  padding: 0.3em 1.3em 0.1em;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 50px;
  background: none;
  cursor: pointer;
}

.text {
  width: 80%;
}
</style>