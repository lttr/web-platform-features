<template>
  <div>
    <div v-for="feature of features" :key="feature.id">
      <BaselineIndicator :feature />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  features: Features
}>()
</script>

<style scoped></style>
