export default defineNuxtConfig({
  compatibilityDate: "2025-04-10",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  devServer: {
    host: "127.0.0.1",
  },
  vite: {
    optimizeDeps: {
      include: ["vue-konva"],
    },
  },
  routeRules: {
    // Render these routes with SPA
    "/projects/**": { ssr: true }, // TODO SSR true on /projects but false on /projects/*
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: "", // Будет переопределено из .env
    },
  },
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/icon",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  icon: {
    mode: "css",
    cssLayer: "base",
    localApiEndpoint: "/_nuxt_icon",
  },
  ui: {
    colorMode: false,
  },
});
