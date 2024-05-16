<template>
  <ul v-auto-animate class="flex flex-col gap-2">
    <li v-for="feature of features" :key="feature.id" class="max-w-[80ch]">
      <BaselineIndicator :feature />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { vAutoAnimate } from "@formkit/auto-animate"

defineProps<{
  features: Features
}>()
</script>

<style scoped></style>
