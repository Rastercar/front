import { createResolver } from '@nuxt/kit'
import vuetify from 'vite-plugin-vuetify'

const { resolve } = createResolver(import.meta.url)

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
    'vuetify/lib/styles/main.sass',
    '@fortawesome/fontawesome-free/css/all.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@vueuse/nuxt'],

  build: {
    transpile: ['vuetify'],
  },

  typescript: {
    strict: true,
  },

  imports: {
    dirs: ['store'],
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:3000/',
    },
  },

  // TODO: enable once: https://github.com/nuxt/nuxt/issues/15412 is fixed
  sourcemap: false,

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
