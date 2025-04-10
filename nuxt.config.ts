import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-04-10",
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3001",
    },
  },
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/image"],
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
  },
});