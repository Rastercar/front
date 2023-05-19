import { ThemeDefinition, createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
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
