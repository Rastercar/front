import { NuxtRenderResponse } from 'nuxt/dist/core/runtime/nitro/renderer'

// https://github.com/nuxt/nuxt/issues/15412
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response: NuxtRenderResponse) => {
    response.body = response.body.replaceAll('/_nuxt/\0', '/_nuxt/')
  })
})
