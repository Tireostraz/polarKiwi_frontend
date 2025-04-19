export default defineNuxtConfig({
  compatibilityDate: "2025-04-10",
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  devServer: {
    host: "127.0.0.1",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: "", // Будет переопределено из .env
    },
  },
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
  ],
});
