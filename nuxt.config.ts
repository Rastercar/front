import { createResolver } from '@nuxt/kit'
import vuetify from 'vite-plugin-vuetify'

const { resolve } = createResolver(import.meta.url)

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  /**
   * SSR has a lot of gotchas, such as lib components and vue plugins that rely
   * on document or window being rendered on a node environment and failing, etc.
   *
   * going to SSR would require a major refactor/testing, so for now keep it disabled
   */
  ssr: false,

  css: [
    '~/assets/css/main.css',
    '~/settings.scss',
    // 'vuetify/lib/styles/main.sass',
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

  // hooks: {
  //   // make nuxt load vuetify settings so you can override sass variables and such, if needed
  //   'vite:extendConfig': (config) => {
  //     config.plugins?.push(
  //       vuetify({
  //         // styles: { configFile: resolve('./settings.scss') },
  //       })
  //     )
  //   },
  // },
})
