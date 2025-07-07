<script setup>
import DriveViewer from "@/components/DriveViewer.vue";

let props = defineProps(["type", "id"])

</script>

<template>
  <div>
    <drive-viewer :mime-type="type" :file-id="id"></drive-viewer>
  </div>
</template>

<style scoped>

</style>