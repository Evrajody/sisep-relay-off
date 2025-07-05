// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    cssPath: "~/assets/css/main.css",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  icon: {
    provider: "iconify",
    serverBundle: false,
  },

  auth: {

    globalAppMiddleware: false,

    isEnabled: false,


  },

  colorMode: {
    preference: "light",
    fallback: "light",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "-mode",
    storage: "localStorage",
    storageKey: "nuxt-color-mode",
  },


  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    "@vueform/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/ui",
    "@element-plus/nuxt",
    "@nuxt/icon",
    "@sidebase/nuxt-auth",
    "nuxt-authorization",
    'nuxt-keen-slider'
  ]
})