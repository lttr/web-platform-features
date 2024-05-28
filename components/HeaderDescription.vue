<template>
  <details class="pb-3">
    <summary class="pb-2">About</summary>
    <div class="flex flex-col gap-4">
      <section>
        <div class="">
          Data came from
          <NuxtLink
            class="underline underline-offset-2"
            to="https://github.com/web-platform-dx/web-features"
            >web-features</NuxtLink
          >
          project, version
          <NuxtLink class="underline underline-offset-2" :to="wf.htmlUrl">{{
            wf.version
          }}</NuxtLink>
          which was published on {{ wfPublishedAt }}.
        </div>
        <div class="">
          And from
          <NuxtLink
            class="underline underline-offset-2"
            to="https://github.com/mdn/browser-compat-data"
            >browser-compat-data</NuxtLink
          >
          project, version
          <NuxtLink class="underline underline-offset-2" :to="bcd.htmlUrl">{{
            bcd.version
          }}</NuxtLink>
          which was published on {{ bcdPublishedAt }}.
        </div>
      </section>

      <section>
        <h3 class="text-sm font-semibold mb-1">Links and resources</h3>
        <ul>
          <li v-for="link of links" :key="link.text" class="list-disc ms-6">
            <NuxtLink :to="link.url" class="underline underline-offset-2">{{
              link.text
            }}</NuxtLink>
          </li>
        </ul>
      </section>
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

const links = [
  {
    url: "https://web.dev/baseline/",
    text: "Articles about Baseline web features",
  },
  {
    url: "https://github.com/web-platform-dx/web-features/blob/main/towards-features.md",
    text: "The reasoning behind web-features project",
  },
  {
    url: "https://chromestatus.com/roadmap",
    text: "Upcoming Chrome features",
  },
  {
    url: "https://mozilla.github.io/standards-positions/",
    text: "Mozilla Specification Positions",
  },
  {
    url: "https://webkit.org/standards-positions/",
    text: "WebKit Standards Positions",
  },
  {
    url: "https://github.com/tc39/proposals",
    text: "Proposals for new JavaScript features",
  },
  {
    url: "https://cssdb.org/",
    text: "CSS feature proposals and standards advancement",
  },
  {
    url: "https://w3c.github.io/web-roadmaps/media/",
    text: "Roadmap for standards for media technologies",
  },
  {
    url: "https://w3c.github.io/web-roadmaps/mobile/",
    text: "Roadmap for standards for mobile devices",
  },
  {
    url: "https://caniuse.com/",
    text: "Can I Use",
  },
  {
    url: "https://browserslist.dev/",
    text: "Browserslist - browser usage distribution",
  },
]
</script>
