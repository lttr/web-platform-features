export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-headlessui",
    "@vueuse/nuxt",
    "@nuxtjs/plausible",
    "@nuxtjs/seo",
  ],

  css: ["~/assets/css/main.css"],

  site: {
    url: "https://web-features.lttr.cz",
    name: "Web features",
    description: "Dashboard of new features available on the web.",
    defaultLocale: "en",
  },

  robots: {
    // not sure why but the meta tag was 'noindex, nofollow' with any
    // combination of configuration i have tried
    metaTag: false,
  },

  headlessui: {
    prefix: "H",
  },

  plausible: {
    ignoredHostnames: ["localhost"],
    // disables console log of ignored events
    // https://github.com/Barbapapazes/plausible-tracker/blob/main/src/plausible.ts#L51C29-L51C39
    logIgnoredEvents: true,
    apiHost: "https://plausible.lttr.cz",
  },

  $production: {
    routeRules: {
      // Features page generated on demand, revalidates in background, cached for 1 hour
      "/": { swr: 60 * 60 },
    },
  },

  compatibilityDate: "2024-07-08",
})
