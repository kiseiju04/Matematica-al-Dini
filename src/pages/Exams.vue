<script setup>
import {onMounted, ref} from "vue";
import Solution from "@/components/Solution.vue";
import {courses, getCourseIndexByName} from "@/Composables/Courses.js";

let props = defineProps(["type", "id", "name"])
let files = ref([])

onMounted(() => {
  if (props.type === "interi") {
    console.log(courses.value)
    files.value = courses.value[getCourseIndexByName(props.id)].interi
  } else {
    const match = props.type.match(/\d+/);
    let index = match ? parseInt(match[0], 10) - 1 : null;

    files.value = courses.value[props.id].parziali[index].files
  }
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