import { defineStore } from 'pinia'

interface LayoutState {
  drawer: {
    open: boolean
    mini: boolean
  }
}

// TODO: add all stores to nuxt auto imports
export const useLayoutStore = defineStore('layout', {
  persist: true,

  state: (): LayoutState => ({ drawer: { open: true, mini: false } }),
})
