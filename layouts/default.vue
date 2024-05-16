<template>
  <UContainer>
    <header class="flex gap-5 items-baseline justify-between max-w-prose">
      <h1 class="text-4xl font-semibold mt-8 mb-4">Web platform features</h1>
      <div class="flex gap-3 p-1">
        <div class="flex h-5">
          <img class="h-5" src="~/assets/baseline/chrome.svg" alt="" />
          <img class="h-5" src="~/assets/baseline/browser-check.svg" alt="" />
        </div>
        <div class="flex h-5">
          <img class="h-5" src="~/assets/baseline/edge.svg" alt="" />
          <img class="h-5" src="~/assets/baseline/browser-check.svg" alt="" />
        </div>
        <div class="flex h-5">
          <img class="h-5" src="~/assets/baseline/firefox.svg" alt="" />
          <img class="h-5" src="~/assets/baseline/browser-check.svg" alt="" />
        </div>
        <div class="flex h-5">
          <img class="h-5" src="~/assets/baseline/safari.svg" alt="" />
          <img class="h-5" src="~/assets/baseline/browser-check.svg" alt="" />
        </div>
      </div>
    </header>

    <main>
      <slot></slot>
    </main>

    <footer class="mt-12"></footer>
  </UContainer>
</template>

<script lang="ts" setup></script>

<style scoped></style>
