export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-headlessui", "@nuxthub/core"],
  headlessui: {
    prefix: "H",
  },
  hub: {
    kv: true,
    cache: true,
  },
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
  $production: {
    routeRules: {
      // Features page generated on demand, revalidates in background, cached for 1 hour
      "/": { swr: 60 * 60 },
    },
  },
})
