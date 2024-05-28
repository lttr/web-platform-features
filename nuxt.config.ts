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
  routeRules: {
    "/": { swr: true },
  },
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
})
