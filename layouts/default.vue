<template>
  <UContainer :ui="{ constrained: 'max-w-5xl' }">
    <header class="flex gap-8 items-baseline justify-between">
      <h1 class="text-4xl font-semibold mt-8 mb-4">Web Platform Features</h1>
      <LogoBrowsers />
    </header>

    <main>
      <slot></slot>
    </main>

    <footer class="mt-12"></footer>
  </UContainer>
</template>
