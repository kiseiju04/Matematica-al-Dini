<script setup>
let props = defineProps(["link", "file"])

function redirect() {
  console.log(props.link)
  open(props.link, "_blank")
}
</script>

<template>
  <div class="sol-link">
    <a
        class="link"
        :href="`https://drive.google.com/file/d/${file.id}/view?usp=sharing`"
        target="_blank"
    >{{ file.name }}</a>
    <a
        class="link sol"
        v-if="link !== undefined"
        @click="redirect"
        target="_blank
  ">sol.</a>
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