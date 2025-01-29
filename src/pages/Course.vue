<script setup>
import {getCourseNameById} from "../Composables/Informations.js";
import {gapi} from "gapi-script";
import { onMounted, ref} from "vue";

const data = ref(null);
let props = defineProps(["id", "type"])
let orali = ref("")
let parziali = ref([])
let interi = ref("")
let opened = ref(false)
let name = ref("")

const fetchData = async () => {
  name.value = getCourseNameById(props.id)

  if (props.type === 'exams') {
    gapi.client.drive.files.list({
      q: `'${props.id}' in parents and trashed = false`,
      fields: 'files(id, name)',
      supportsAllDrives: true
    }).then(response => {
      var files = response.result.files

      for (var i = 0; i < files.length; i++) {
        if (files[i].name.includes("parziale")) {
          parziali.value.push(files[i])
        } else if (files[i].name === "Interi") {
          interi.value = files[i].id
        } else if (files[i].name === "Orali") {
          orali.value = files[i].id
        }
      }

      parziali.value.sort((a,b) => a.name > b.name)

    }).catch((error) => {
      console.error("Errore durante la lettura dei file", error);
    });
  }
};

onMounted(() => {
  setTimeout(fetchData, 400)
});
</script>

<template>
  <div class="page">
    <p class="title" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']">{{ name }}</p>
    <template v-if="type === 'exams'">
      <router-link class="link" :to="`/exams/${interi}/interi ${getCourseNameById(id)}`">- interi</router-link>
      <div class="list">
        <p class="link" @click="opened = !opened">- parziali</p>

        <div class="sub-list" v-if="opened">
          <router-link
              v-for="p in parziali"
              :to="`/exams/${p.id}/${p.name} ${getCourseNameById(id)}`"
              class="link"
          >- {{ p.name }}</router-link>
        </div>
      </div>
      <a
          class="link"
          :href="`https://docs.google.com/document/d/${orali}/edit?usp=sharing`"
          target="_blank"
      >- orali</a>
    </template>
    <template v-if="type === 'notes'">
      <div></div>

      <div>
        <p>- lezione 21/01/2018</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.title {
  margin: 0.5em 0 1em;
}

.sub-list {
  margin: 0 0 0 4em;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5em;
}

.list {
  margin: 1em 0;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5em;
}

.link {
  color: white;
  text-decoration: none;
}
</style>