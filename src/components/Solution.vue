<script setup>
import {onMounted, ref} from "vue";

let props = defineProps(["link", "file"])

let solID = ref("")
let solType = ref("")

let realType = ref("")

function extractFileId(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : ''
}

function detectType(link) {
  if (link && link === "")
    return

  if (link.includes('/preview')) return 'pdf'
  if (link.match(/\.(png|jpg|jpeg|gif)/)) return 'image'
  return 'unknown'
}

onMounted(() => {
  if (props.link !== undefined && props.link !== '') {
    solID = extractFileId(props.link)
    solType = detectType(props.link)
  }

  if (props.file.mimeType.includes("image")) {
    realType.value = "image"
  } else if (props.file.mimeType.includes("application")) {
    realType.value = "pdf"
  }
})
</script>

<template>
  <div class="sol-link">
    <router-link
        class="link"
        :to="`/exam/${realType}/${file.id}`"
    >-{{ file.name }}</router-link>

    <router-link
        class="link sol"
        v-if="link !== undefined && link !== ''"
        :to="`/exam/${solType}/${solID}`"
    >sol.</router-link>
  </div>
</template>

<style scoped>
.link {
  color: white;
  text-decoration: none;
}

.sol-link {
  position: relative;
  z-index: 0;
}

.sol {
  z-index: 0;
  grid-column: 1 / 2;
  position: absolute;
  right: -3em;
  cursor: pointer;
}
</style>