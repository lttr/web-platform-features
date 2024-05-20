<template>
  <details class="py-2">
    <summary class="py-1">About</summary>
    <div class="">
      Data came from
      <NuxtLink
        class="underline"
        to="https://github.com/web-platform-dx/web-features"
        >web-features</NuxtLink
      >
      project, version
      <NuxtLink class="underline" :to="htmlUrl">{{ version }}</NuxtLink>
      which was published on {{ publishedAt }}.
    </div>
  </details>
</template>

<script lang="ts" setup>
const props = defineProps<{
  htmlUrl: string
  version: string
  publishedAt: string
}>()

const publishedAt = computed(() => formatDateShort(props.publishedAt))

function formatDateShort(date: string): string {
  if (!date) {
    return ""
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(date))
}
</script>

<style scoped></style>
