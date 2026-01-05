// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  nitro: {
    preset: "node-server",
    storage: {
      pcm: {
        driver: 'fs',
        base: './.data/pcm'
      }
    }
  }
})
