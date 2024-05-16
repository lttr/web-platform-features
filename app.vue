<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId())
</script>
