import { defineStore } from 'pinia'

interface LayoutState {
  drawer: {
    open: boolean
    mini: boolean
  }
}

export const useLayoutStore = defineStore('layout', {
  persist: true,

  state: (): LayoutState => ({ drawer: { open: true, mini: false } }),
})
