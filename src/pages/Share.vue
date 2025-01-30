<script setup>
import {onMounted, ref} from "vue";
import {accessToken} from "@/Composables/Informations.js";

const selectedFile = ref(null);
const uploadStatus = ref("");
const folderId = "14HPG4wZFpvnMaM0NYyshcyBsmFjOwPBk";
const documentText = ref("");
const docId = ref("");

const selectFile = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  let link = ""

  if (selectedFile.value) {
    const metadata = {
      name: selectedFile.value.name,
      mimeType: selectedFile.value.type,
      parents: [folderId]
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], {type: "application/json"}));
    formData.append("file", selectedFile.value);

    try {
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {"Authorization": `Bearer ${accessToken.value}`},
        body: formData
      });

      const data = await response.json();

      link = `https://drive.google.com/file/d/${data.id}`;

    } catch (error) {
      console.error("Errore:", error);
    }
  }

  try {
    const documentMetadata = {
      name: "Condivisione",
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId]
    };

    const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken.value}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Condivisione"
      })
    });

    const createData = await createResponse.json();
    console.log(createData)
    docId.value = createData.documentId;

    await fetch(`https://docs.googleapis.com/v1/documents/${docId.value}:batchUpdate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken.value}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [{
          insertText: {
            location: { index: 1 },
            text: documentText.value + " " + link
          }
        }]
      })
    });

    const moveToFolderResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${docId.value}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken.value}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        addParents: folderId,
        removeParents: "root"
      })
    });

    const moveToFolderData = await moveToFolderResponse.json();
    console.log("Documento spostato nella cartella:", moveToFolderData);

    if (moveToFolderData.id) {
      console.log("File spostato correttamente");
    } else {
      console.log("Problema nel spostare il file");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
};

const checkFileLocation = async (fileId) => {
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=parents`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken.value}`,
      }
    });

    const data = await response.json();
    console.log("File Parent Information:", data);
    if (data.parents) {
      console.log("Il file è nelle cartelle con ID:", data.parents);
    } else {
      console.log("Il file non ha parent.");
    }
  } catch (error) {
    console.error("Errore nel recuperare i dettagli del file:", error);
  }
};

onMounted(() => {
  checkFileLocation("1I-F3OqDm9iyJKWDBh340PfFLzxmKlN4skhgzA4JEf5E");
})

/*
  todo
  <textarea v-model="documentText" placeholder="Il nome di cosa stai condividendo e informazioni aggiuntive"></textarea>

  <input @change="selectFile" style="margin-top: 1em" class="share-cl" type="file" id="fileInput" accept="image/*">
 */
</script>

<template>
<div class="page">
  <p class="share-cl">CONDIVIDI</p>

  <p class="text">
    clicca il bottone qui sotto per accedere ad un drive dove caricare le foto dei compiti. <br>
    se invece vuoi condividere le domande di un orale crea un nuovo file docs con le varie domande
  </p>

  <a target="_blank" href="https://drive.google.com/drive/folders/14HPG4wZFpvnMaM0NYyshcyBsmFjOwPBk?usp=sharing" class="link share-cl">CARICA</a>
</div>
</template>

<style scoped>
textarea {
  padding: 1em;
  width: 60%;
  color: white;
  aspect-ratio: 4 / 2;
  background: none;
  border: 1px solid var(--share-cl);
  border-radius: 20px;
}

.link {
  font-size: 0.5em;
  margin-top: 2em;
  padding: 0.3em 1.3em 0.1em;
  text-decoration: none;
  border: 1px solid currentColor;
  border-radius: 50px;
  background: none;
  cursor: pointer;
}

.text {
  width: 80%;
}
</style>