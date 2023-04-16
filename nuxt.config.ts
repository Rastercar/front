import { createResolver } from '@nuxt/kit'
import vuetify from 'vite-plugin-vuetify'

const { resolve } = createResolver(import.meta.url)

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '@fortawesome/fontawesome-free/css/all.css',
  ],
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  build: {
    transpile: ['vuetify'],
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/',
    },
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins?.push(
        vuetify({
          styles: { configFile: resolve('./settings.scss') },
        })
      )
    },
  },
})
