// shared drive id 1skWrFIi8-tOafzj2ObXgscfIOVJMUfHc
import { gapi } from "gapi-script";
import {ref} from "vue";

const CLIENT_ID = "682653094659-te6d9c7ghsouftfmlcq3d7m7k2pvbts2.apps.googleusercontent.com";
const API_KEY = "AIzaSyB_fHOmXyFFVFP-eSPBaoKCkfUesSYvljI";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive";

var loggedIn = ref(false)

var courses = ref([])
var uploadFolderId = ref("")

const accessToken = ref("");

var notes_courses = ref([])

var generatedData = ref({})

const initGoogleDrive = (callback) => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      callback()
      const token = localStorage.getItem('access_token');
      if (token) {
        accessToken.value = token
        loggedIn.value = true
      } else {
        loggedIn.value = false
      }
    }).catch(error => console.error("Errore di inizializzazione:", error));
  });
};

const signIn = () => {
  google.accounts.oauth2.initTokenClient({
    client_id: "682653094659-te6d9c7ghsouftfmlcq3d7m7k2pvbts2.apps.googleusercontent.com", // Sostituisci con il tuo Client ID
    scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file",
    callback: (response) => {
      if (response.access_token) {
        accessToken.value = response.access_token;
        loggedIn.value = true
      }
    }
  }).requestAccessToken();
};

async function getRootFolder() {
  const folderId = '1skWrFIi8-tOafzj2ObXgscfIOVJMUfHc';

  generatedData.value["courses"] = []
  generatedData.value["notes_courses"] = []

  let response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  })

  var files = response.result.files

  for (var i = 0; i < files.length; i++) {
    if (files[i].name === "Upload") {
    } else {
      await getCoursesFolder(files[i].id)
    }
  }

  await getNotesCoursesFolder()
}

async function getCoursesFolder(folderId) {
  let response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  })

  courses.value = response.result.files

  for (var j = 0; j < courses.value.length; j++) {
    generatedData.value["courses"].push({name: courses.value[j].name})
  }

  for (var i = 0; i < courses.value.length; i++) {
    await getCourseFile(courses.value[i].id, courses.value[i].name)
  }
}

async function getNotesCoursesFolder() {
  let folderId = "1U5d5V_5JciAQ7w8QHf8rchjExLkUTyg3"
  let response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  })

  notes_courses.value = response.result.files

  for (var j = 0; j < notes_courses.value.length; j++) {
    generatedData.value["notes_courses"].push({name: notes_courses.value[j].name})
  }

  for (var i = 0; i < notes_courses.value.length; i++) {
    await getCourseFile(notes_courses.value[i].id, notes_courses.value[i].name,true)
  }
}

async function getCourseFile(id, name, notes = false) {
  if (!notes) {
    let response = await gapi.client.drive.files.list({
      q: `'${id}' in parents and trashed = false`,
      fields: 'files(id, name)',
      supportsAllDrives: true
    })

    var files = response.result.files
    generatedData.value["courses"][getCourseIndexByName(name)]["parziali"] = []

    for (var i = 0; i < files.length; i++) {
      if (files[i].name.includes("parziale")) {
        await getExams(files[i].id, name, files[i].name)
      } else if (files[i].name === "Interi") {
        await getExams(files[i].id, name, "interi")
      } else if (files[i].name === "Orali") {
        generatedData.value["courses"][getCourseIndexByName(name)]["orali"] = files[i].id
      }
    }
  } else {
    let response = await gapi.client.drive.files.list({
      q: `'${id}' in parents and trashed = false`,
      fields: 'files(id, name, description)',
      supportsAllDrives: true
    })

    generatedData.value["notes_courses"][getNotesCourseIndexByName(name)]["files"] = response.result.files
  }
}

async function getExams(id, name, type) {
  let response = await gapi.client.drive.files.list({
    q: `'${id}' in parents and trashed = false`,
    fields: 'files(id, name, description)',
    supportsAllDrives: true
  })

  if (type.includes("parziale")) {
    const match = type.match(/\d+/);
    let index = match ? parseInt(match[0], 10) - 1 : null;
    generatedData.value["courses"][getCourseIndexByName(name)]["parziali"][index] = {name: `${index + 1} parziale`, files: response.result.files}
    generatedData.value["courses"][getCourseIndexByName(name)]["parziali"][index].files.sort((a, b) => a.name > b.name)
    return
  }

  generatedData.value["courses"][getCourseIndexByName(name)][type] = response.result.files
  generatedData.value["courses"][getCourseIndexByName(name)][type].sort((a, b) => a.name > b.name)
}

function getCourseIndexByName(name) {
  var el = generatedData.value["courses"].filter((a) => a.name === name)[0]
  return generatedData.value["courses"].indexOf(el)
}

function getNotesCourseIndexByName(name) {
  var el = generatedData.value["notes_courses"].filter((a) => a.name === name)[0]
  return generatedData.value["notes_courses"].indexOf(el)
}

function getNotesCourseNameById(id) {
  for (var i = 0; i < notes_courses.value.length; i++) {
    if (notes_courses.value[i].id === id)
      return notes_courses.value[i].name
  }
}

export {
  getCoursesFolder,
  getRootFolder,
  signIn,
  initGoogleDrive,
  loggedIn,
  courses,
  uploadFolderId,
  accessToken,
  notes_courses,
  getNotesCoursesFolder,
  getNotesCourseNameById,
  generatedData,
  getCourseIndexByName,
  getNotesCourseIndexByName
}
