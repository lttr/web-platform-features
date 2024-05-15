export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui"],
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
})
