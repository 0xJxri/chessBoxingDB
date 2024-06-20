export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  nitro: {
    serveStatic: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@tresjs/nuxt",
  ],
  runtimeConfig: {
    public: {
      // baseUrl: process.env.BASE_URL || 'http://localhost:8000'
      // baseUrl: "http://localhost:8000",
      baseUrl: "https://chessboxingdb.onrender.com",
    }
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
