<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {loggedIn, username} from "@/Composables/Info.js";
import {login} from "@/Composables/Info.js";

const props = defineProps({
  fileId: String,
  mimeType: String
})

const fileUrl = ref('')
const comment = ref('')
const comments = ref([])

const tagCl = [ {
  cl: '181 238 185',
  bg: '181 238 185 0.1'
},{
  cl: '255 163 163',
  bg: '255 163 163 0.1'
},{
  cl: '210 175 234',
  bg: '210 175 234 0.1'
}
]

onMounted(() => {
  fileUrl.value = `https://drive.google.com/file/d/${props.fileId}/preview`
  loadComments()
})

async function loadComments() {
  try {
    const res = await axios.get(`https://matematica-al-dini-backend.onrender.com/comments/${props.fileId}`)
    comments.value = res.data || []
  } catch (err) {
    console.error('❌ Errore nel caricamento commenti:', err)
  }
}

async function submitComment() {
  if (!comment.value.trim()) return

  try {
    await axios.post('https://matematica-al-dini-backend.onrender.com/upload-comment', {
      file_id: props.fileId,
      text: username.value + ": " + comment.value.trim(),
      owner: username.value
    })

    comment.value = ''
    await loadComments()
  } catch (err) {
    console.error('❌ Errore durante l\'invio del commento:', err)
  }
}

async function deleteComment(id) {
  console.log(comments)

  try {
    await axios.post('https://matematica-al-dini-backend.onrender.com/delete-comment', {
      comment_id: id
    })

    await loadComments()
  } catch (err) {
    console.error('❌ Errore durante l\'invio del commento:', err)
  }
}

function getRandomCl() {
  let rn = Math.random() * 100

  if (rn < 33) {
    return 1
  } else if (rn < 66) {
    return 2
  } else {
    return 3
  }
}
</script>

<template>
  <div class="viewer-container">
    <div class="left">
      <!--<div class="tags">
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="tag" :class="['tag-' + getRandomCl()]">tag1</p>
        <p class="add-tag" :class="['tag-' + getRandomCl()]">+</p>
      </div>-->
      <iframe
          v-if="fileUrl"
          :src="fileUrl"
          frameborder="0"
          width="100%"
          height="100%"
      ></iframe>
    </div>

    <div class="right">
      <h3>Commenti</h3>
      <ul class="comment-list">
        <li v-for="(c, i) in comments" :key="i">
          <span v-if="c.owner === username" class="delete" @click="deleteComment(c.comment_id)">x</span> <strong>{{ c.text.split(':')[0] }}</strong>: {{ c.text.split(':').slice(1).join(':') }}
        </li>
      </ul>

      <template v-if="loggedIn">
        <textarea v-model="comment" placeholder="Scrivi un commento..." class="textarea"></textarea>
        <button @click="submitComment" class="submit-button">Invia</button>
      </template>
      <template v-else>
        <button class="login-button" @click="login = true">
          Accedi per commentare
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.viewer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1em;
  box-sizing: border-box;
  gap: 1em;
}

.left {
  flex: 2;
  border-radius: 10px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  //grid-template-rows: auto 1fr;
  grid-template-rows: 1fr;
  row-gap: 1em;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
}

.tags {
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 0.25em;
  align-items: center;
  justify-items: center;
}

.tag {
  --cl: #ffffff;
  --bg: rgba(255, 255, 255, 0.1);

  font-size: 0.75em;
  width: fit-content;
  padding: 0.15em 1em;
  border-radius: 10em;
  border: var(--cl) 1px solid;
  background: var(--bg);
}

.add-tag {
  --cl: #ffffff;
  --bg: rgba(255, 255, 255, 0.1);

  font-size: 0.75em;
  width: fit-content;
  border: var(--cl) 1px solid;
  background: var(--bg);
  padding: 0.15em 0.5em;
  border-radius: 100%;
  cursor: pointer;
}

.tag-1 {
  --cl: rgb(181, 238, 185);
  --bg: rgba(181, 238, 185, 0.1)
}

.tag-2 {
  --cl: rgb(255, 163, 163);
  --bg: rgba(255, 163, 163, 0.1)
}

.tag-3 {
  --cl: rgb(210, 175, 234);
  --bg: rgba(210, 175, 234, 0.1)
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1em;
  border-radius: 10px;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1em;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  color: white;
  font-family: "DkCrayonCrumble";

  li {
    margin-bottom: 0.5em;
    padding: 1em 1em;
    background: rgba(255, 255, 255, .1);
    border-radius: 20px;
    border: none;
    border-left: var(--share-cl) 5px solid;
  }
}

.textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 0.5em;
  padding: 0.5em;
  border-radius: 10px;
  font-family: "DkCrayonCrumble";
  background: rgba(255, 255, 255, .1);
  color: white;
  border: var(--share-cl) 1px solid;
  font-size: 1em;
  resize: vertical;
}

.submit-button, .login-button {
  align-self: center;
  font-size: 1.25em;
  width: fit-content;
  color: var(--share-cl);
  background: none;
  padding: 0.6em 1em;
  border: var(--share-cl) 1px solid;
  border-radius: 2em;
  font-weight: bold;
  cursor: pointer;
  font-family: "DkCrayonCrumble";
}

.login-button {
  background: none;
  margin-top: 1em;
}

.delete {
  text-align: right;
  color: #D2AFEA;
  cursor: pointer;
}

@media (min-width: 768px) {
  .viewer-container {
    flex-direction: row;
  }
  .left, .right {
    height: auto;
    width: 50%;
  }
}
</style>