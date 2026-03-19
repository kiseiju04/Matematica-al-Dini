<script setup>
import {onMounted, watch} from "vue";
import {motion} from "motion-v";

let status = defineModel('status')

function startTimer() {
  setTimeout(() => { status.value = false }, 20 * 1000)
}

watch(status, () => {
  if (status.value) {
    startTimer()
  }
})

onMounted(() => {
  startTimer()
})
</script>

<template>
  <div v-if="status" class="popup">
    <div class="progress-bg">
      <motion.div class="progress" :animate="{ width: 0 }" :transition='{ duration: 20 }'></motion.div>
    </div>
    <H1 class="title">Un attimo, ci dai una mano?</H1>

    <p class="text">
      Siamo studenti e abbiamo creato questo sito gratuitamente per aiutare altri studenti come noi.<br><br>
      Al momento è ospitato su un server personale, ma non è una soluzione sostenibile nel tempo.<br><br>
      Per questo abbiamo aperto una piccola colletta: anche un contributo minimo può aiutarci a mantenere il progetto attivo e accessibile a tutti.
    </p>

    <button class="esc notes-cl" @click="status = false">ESCI</button>
    <a href="https://www.paypal.com/pool/9n6rPtE520?sr=ancr" target="_blank" class="donate exams-cl">DONA ORA</a>
  </div>
</template>

<style scoped>
.popup {
  border: white solid 1px;
  border-radius: 1em;
  inset: 0;
  bottom: 0;
  left: 20px;
  right: 20px;
  top: 50px;
  width: fit-content;
  height: fit-content;
  background: rgba(20, 20, 20);
  position: absolute;
  margin: 0 auto;
  z-index: 1000;
  padding-bottom: 1em;

  display: grid;
  grid-template-columns: 1fr 1fr;
}

.progress-bg {
  border-radius: 1em 1em 0 0;
  width: 100%;
  height: 1em;
  background: rgba(255, 255, 255, 0.3);
}

.progress {
  border-radius: 1em 0 0 0;
  width: 100%;
  height: 1em;
  background: rgba(255, 255, 255, 0.7);
}

.title, .text, .progress-bg {
  grid-column: 1 / -1;
}

.title {
  font-size: 1.5em;
}

.text {
  margin: 0.5em;
}

.donate, .esc {
  align-self: center;
  justify-self: center;
  padding: 0.3em 1.3em 0.1em;
  border: 1px solid currentColor;
  text-decoration: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}
</style>