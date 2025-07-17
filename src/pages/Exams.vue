<script setup>
import {onMounted, ref} from "vue";
import Solution from "@/components/Solution.vue";
import {courses, getCourseIndexByName, getSubfolderIndexByName} from "@/Composables/Courses.js";

let props = defineProps(["type", "id", "name"])
let files = ref([])
let subfolders = ref([])

onMounted(() => {
  if (props.type === "interi") {
    files.value = courses.value[getCourseIndexByName(props.id)].interi.files
    subfolders.value = courses.value[getCourseIndexByName(props.id)].interi.sottocartelle
  } else if (props.type === "esercizi") {
    files.value = courses.value[getCourseIndexByName(props.id)].esercizi.files
    subfolders.value = courses.value[getCourseIndexByName(props.id)].esercizi.sottocartelle
  } else if (props.type === "parziali") {
    const match = props.name.match(/\d+/);
    let index = match ? parseInt(match[0], 10) - 1 : null;

    files.value = courses.value[getCourseIndexByName(props.id)].parziali[index].files
    subfolders.value = courses.value[getCourseIndexByName(props.id)].parziali[index].sottocartelle
  } else {
    subfolders.value = []

    let typeFix = props.type.split('-')

    if (typeFix[1] === "sottocartelle") {
      files.value = courses.value[typeFix[0]].sottocartelle[typeFix[2]].files
    } else if (typeFix[1] === "esercizi") {
      courses.value[typeFix[0]].esercizi.sottocartelle[typeFix[2]].files
    } else if (typeFix[1] === "interi") {
      courses.value[typeFix[0]].interi.sottocartelle[typeFix[2]].files
    } else {
      courses.value[typeFix[0]].parziali[typeFix[1]].sottocartelle[typeFix[2]].files
    }
  }
})
</script>

<template>
  <div class="page">
    <p class="title exams-cl">{{ name }}</p>
    <div class="list">
      <p class="link" v-if="files.length === 0 && subfolders.length === 0">Nessun File</p>
      <router-link class="link" :to="'/exams/' + s.path + '/' + id + '/' + s.name" v-for="s in subfolders">- {{ s.name }}</router-link>
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

.link {
  color: white;
  text-decoration: none;
}

.list {
  margin: 1em 0;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5em;
  justify-items: left;
}
</style>