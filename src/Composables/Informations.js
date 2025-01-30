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

function getRootFolder(loaded) {
  const folderId = '1skWrFIi8-tOafzj2ObXgscfIOVJMUfHc';

  gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  }).then(response => {
    var files = response.result.files

    for (var i = 0; i < files.length; i++) {
      if (files[i].name === "Upload") {
        uploadFolderId.value = files[i].id
      } else {
        getCoursesFolder(files[i].id)
      }
    }

    loaded.value = true
  }).catch((error) => {
    console.error("Errore durante la lettura dei file", error);
  });
}

function getCoursesFolder(folderId) {
  gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  }).then(response => {
    courses.value = response.result.files
  }).catch((error) => {
    console.error("Errore durante la lettura dei file", error);
  });
}

function getNotesCoursesFolder() {
  let folderId = "1U5d5V_5JciAQ7w8QHf8rchjExLkUTyg3"
  gapi.client.drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    supportsAllDrives: true
  }).then(response => {
    notes_courses.value = response.result.files
  }).catch((error) => {
    console.error("Errore durante la lettura dei file", error);
  });
}

function getCourseNameById(id) {
  for (var i = 0; i < courses.value.length; i++) {
    if (courses.value[i].id === id)
        return courses.value[i].name
  }
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
  getCourseNameById,
  accessToken,
  notes_courses,
  getNotesCoursesFolder,
  getNotesCourseNameById
}
