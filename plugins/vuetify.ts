import { aliases, fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // Keep in sync with nuxt.config.ts ssr prop
    ssr: false,

    icons: {
      sets: { fa },
      aliases,
      defaultSet: 'fa',
    },
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#8B5CF6',
            surface: '#1E293B',
            background: '#0F172A',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
