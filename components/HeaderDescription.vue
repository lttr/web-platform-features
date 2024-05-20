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
      <NuxtLink class="underline" :to="wf.htmlUrl">{{ wf.version }}</NuxtLink>
      which was published on {{ wfPublishedAt }}.
    </div>
    <div class="">
      And from
      <NuxtLink
        class="underline"
        to="https://github.com/mdn/browser-compat-data"
        >browser-compat-data</NuxtLink
      >
      project, version
      <NuxtLink class="underline" :to="bcd.htmlUrl">{{ bcd.version }}</NuxtLink>
      which was published on {{ bcdPublishedAt }}.
    </div>
  </details>
</template>

<script lang="ts" setup>
import type { WebFeaturesPackage } from "~/utils/web-features-output"

const { bcd, wf } = defineProps<{
  bcd: WebFeaturesPackage["bcd"]
  wf: WebFeaturesPackage["wf"]
}>()

const bcdPublishedAt = computed(() => formatDateShort(bcd.publishedAt))
const wfPublishedAt = computed(() => formatDateShort(wf.publishedAt))

function formatDateShort(date: string): string {
  if (!date) {
    return ""
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(date))
}
</script>
