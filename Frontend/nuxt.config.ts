export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})
