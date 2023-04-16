import { createVuetify } from 'vuetify'
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
  })

  nuxtApp.vueApp.use(vuetify)
})
