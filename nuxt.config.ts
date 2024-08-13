export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-headlessui"],

  headlessui: {
    prefix: "H",
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

  compatibilityDate: "2024-07-08",
})
