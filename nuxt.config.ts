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
})
