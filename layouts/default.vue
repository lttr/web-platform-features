<template>
  <UContainer :ui="{ constrained: 'max-w-5xl' }">
    <header class="flex gap-8 items-baseline justify-between">
      <h1 class="md:text-4xl text-3xl font-semibold md:mt-8 mt-4 md:mb-4 mb-2">
        Web Platform Features
      </h1>
      <LogoBrowsers />
    </header>

    <main>
      <slot></slot>
    </main>

    <footer class="mt-12"></footer>
  </UContainer>
</template>
