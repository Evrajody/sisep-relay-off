// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
    apiSecret: '0198b20d-4a7c-7412-9f05-97e88bb6b3cb',
    public: {
      sisebApiBaseUrl: process.env.NUXT_PUBLIC_SISEB_API_BASE_URL,
    }
  },
  css: ['~/assets/css/main-siseb.css'],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
    clearScreen: false,
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core'],
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_SISEB_API_BASE_URL,
        changeOrigin: true,
      },
    },
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    cssPath: "~/assets/css/main-siseb.css",
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

  extends: ["@nuxt/ui-pro"],


  modules: [
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
    'nuxt-keen-slider',
    '@nuxtjs/leaflet',
  ],
})