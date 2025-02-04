<script setup>
import { onMounted, ref } from "vue";
import {courses, getCourseIndexByName, getNotesCourseIndexByName, notes_courses} from "@/Composables/Courses.js";

let props = defineProps(["id", "type"])
let opened = ref(false)
let displayNotes = ref([])
let input = ref("")

function filter() {
  displayNotes.value = [...notes_courses.value[getNotesCourseIndexByName(props.id)].files]
  displayNotes.value = displayNotes.value.filter((a) => {
    var toSearch = a.name.toLowerCase()

    if (a.description !== undefined) {
      toSearch += " " + a.description.toLowerCase()
    }

    return toSearch.includes(input.value.toLowerCase())
  })
}

onMounted(() => {
  filter()
})
</script>

<template>
  <div class="page">
    <p class="title" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']">{{ id }}</p>
    <template v-if="type === 'exams'">
      <router-link class="link" :to="`/exams/interi/${id}/interi ${ id }`">- interi</router-link>
      <div class="list">
        <p class="link" @click="opened = !opened">- parziali</p>

        <div class="sub-list" v-if="opened">
          <router-link
              v-for="p in courses[getCourseIndexByName(id)].parziali"
              :to="`/exams/${p.name}/${getCourseIndexByName(id)}/${p.name} ${id}`"
              class="link"
          >- {{ p.name }}</router-link>
        </div>
      </div>
      <a
          class="link"
          :href="`https://docs.google.com/document/d/${courses[getCourseIndexByName(id)].orali}/edit?usp=sharing`"
          target="_blank"
      >- orali</a>
    </template>
    <template v-if="type === 'notes'">
      <div class="search" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']">
        <span :class="[type === 'exams' ? 'search-logo-e' : 'search-logo-n']"></span>
        <input @input="filter" v-model="input" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']" placeholder="cerca" type="text">
      </div>

      <div class="list">
        <a
            class="link"
           :href="`https://drive.google.com/file/d/${n.id}/view?usp=sharing`"
            v-for="n in displayNotes"
        >- {{ n.name }}</a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  grid-template-rows: auto auto auto auto auto 1fr;
}

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
  cursor: pointer;
}

.search {
  border: 1px solid currentColor;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 1em 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;

  span {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    width: 0.8em;
    aspect-ratio: 1;
    background-size: cover;
  }

  input {
    width: calc(100% - 2.2em);
    justify-self: end;
    grid-column: 1 / -1;
    grid-row: 1 / 2;
    background: none;
    border: none;
    outline: none;
  }
}


.search-logo-e {
  background-image: url("../assets/search-exams.svg");
}

.search-logo-n {
  background-image: url("../assets/search-notes.svg");
}
</style>