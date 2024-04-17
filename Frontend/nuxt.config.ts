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
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
