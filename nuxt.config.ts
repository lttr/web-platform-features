export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-headlessui",
    "@vueuse/nuxt",
    "@nuxtjs/plausible",
  ],

  headlessui: {
    prefix: "H",
  },

  plausible: {
    ignoredHostnames: ["localhost"],
    apiHost: "https://plausible.lttr.cz",
  },

  $production: {
    routeRules: {
      // Features page generated on demand, revalidates in background, cached for 1 hour
      "/": { swr: 60 * 60 },
    },
  },

  vite: {
    vue: {
      features: {
        propsDestructure: true,
      },
    },
  },

  compatibilityDate: "2024-07-08",
})
