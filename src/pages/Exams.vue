<script setup>
import {onMounted, ref} from "vue";
import {gapi} from "gapi-script";
import Solution from "@/components/Solution.vue";

let props = defineProps(["id", "name"])
var files = ref([])

onMounted(() => {
    gapi.client.drive.files.list({
      q: `'${props.id}' in parents and trashed = false`,
      fields: 'files(id, name, description)',
      supportsAllDrives: true
    }).then(response => {
      files.value = response.result.files
      files.value.sort((a, b) => a.name > b.name)
    }).catch((error) => {
      console.error("Errore durante la lettura dei file", error);
    });
})
</script>

<template>
  <div class="page">
    <p class="title exams-cl">{{ name }}</p>
    <div class="list">
      <Solution :key="f.id" :link="f.description" :file="f" v-for="f in files"></Solution>
    </div>
  </div>
</template>

<style scoped>
.page {
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
}

.title {
  margin: 0.5em 0 0;
}

.list {
  margin: 1em 0;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5em;
  justify-items: left;
}
</style>