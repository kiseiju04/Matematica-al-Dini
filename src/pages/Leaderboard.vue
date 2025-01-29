<script setup>

</script>

<template>
  <div class="page">
    <div class="score">
      <p class="title">IL TUO PUNTEGGIO</p>
      <p class="score-text">sei 4° con 456 pt</p>
    </div>

    <div class="leaderboard">
      <p class="TOP 10"></p>
      <div class="scores">
        <p v-for="i in 10">{{ i }}. a: 456 pt</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>