<script setup>
import {courses, getNotesCoursesFolder, notes_courses} from "@/Composables/Informations.js";
import {onMounted, ref} from "vue";
let props = defineProps(["type"])
let displayedCourses = ref([])
let input = ref("")
function filter() {
  if (props.type === "exams") {
    displayedCourses.value = [...courses.value]
    displayedCourses.value = displayedCourses.value.filter((a) => a.name.toLowerCase().includes(input.value.toLowerCase()))
    displayedCourses.value.sort((a, b) => a.name > b.name)
  } else {
    displayedCourses.value = [...notes_courses.value]
    displayedCourses.value = displayedCourses.value.filter((a) => a.name.toLowerCase().includes(input.value.toLowerCase()))
    displayedCourses.value.sort((a, b) => a.name > b.name)
  }
}

onMounted(() => {
  if (props.type === "notes") {
    getNotesCoursesFolder()
  }

  filter()

  setTimeout(() => {
    filter()
  }, 1000)
})
</script>

<template>
  <div class="page">
    <p class="title" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']">CORSI</p>
    <div class="search" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']">
      <span :class="[type === 'exams' ? 'search-logo-e' : 'search-logo-n']"></span>
      <input @input="filter" v-model="input" :class="[type === 'exams' ? 'exams-cl' : 'notes-cl']" placeholder="cerca" type="text">
    </div>
    <div class="list list-notes">
      <router-link :key="c.id" class="link" :to="`/course/${c.id}/${type}`" v-for="c in displayedCourses">- {{ c.name }}</router-link>
    </div>
  </div>
</template>

<style scoped>
.page {
  grid-template-rows: auto auto auto 1fr;
  grid-row-gap: 0.5em;
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

.search-logo-e {
  background-image: url("../assets/search-exams.svg");
}

.search-logo-n {
  background-image: url("../assets/search-notes.svg");
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

.link {
  color: white;
  text-decoration: none;
}

</style>