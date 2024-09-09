import Aura from "@primevue/themes/aura";
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    '@pinia/nuxt',
    "nuxt3-leaflet",
    "nuxt-icon",
    "nuxt-echarts"
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  css: ["/assets/css/main.css", 'primeicons/primeicons.css'],
  app: {
    head: {
      title: "MOEN | Online Data App",
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/assets/img/Fakhar.png' }
      ]
    },
  },
  pinia: {
    autoImports: ['defineStore'],
    imports: {
      dir: ['./stores']
    }
  }
});