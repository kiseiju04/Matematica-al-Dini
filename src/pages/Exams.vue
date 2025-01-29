<script setup>
import {onMounted, ref} from "vue";
import {gapi} from "gapi-script";

let props = defineProps(["id", "name"])
var files = ref([])

onMounted(() => {
    gapi.client.drive.files.list({
      q: `'${props.id}' in parents and trashed = false`,
      fields: 'files(id, name)',
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
      <a
          class="link"
          v-for="f in files"
          :href="`https://drive.google.com/file/d/${f.id}/view?usp=sharing`"
          target="_blank"
      >{{ f.name }}</a>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin: 0.5em 0 0;
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