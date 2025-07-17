import {ref} from "vue";

var courses = ref([])

var notes_courses = ref([])

function getCourseIndexByName(name) {
  var el = courses.value.filter((a) => a.name === name)[0]
  return courses.value.indexOf(el)
}

function getSubfolderIndexByName(src, name) {
  return src.indexOf((s) => s.name = name)
}

function getNotesCourseIndexByName(name) {
  var el = notes_courses.value.filter((a) => a.name === name)[0]
  return notes_courses.value.indexOf(el)
}

export {
  courses,
  notes_courses,
  getCourseIndexByName,
  getNotesCourseIndexByName,
  getSubfolderIndexByName
}