import {ref} from "vue";
import {generatedData} from "@/Composables/Informations.js";

var courses = ref([])

var notes_courses = ref([])

function getCourseIndexByName(name) {
  var el = courses.value.filter((a) => a.name === name)[0]
  return courses.value.indexOf(el)
}

export {
  courses,
  notes_courses,
  getCourseIndexByName
}