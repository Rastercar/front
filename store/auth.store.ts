import { defineStore } from 'pinia'
import { User } from '~~/api/types'

interface AuthState {
  /**
   * The logged in user
   */
  user: User | null

  /**
   * A JWT bearer token used to authenticate within the rastercar api
   */
  apiToken: string | null

  /**
   * The organization selected/being viewed on the client dashboard/pages, if the current user is a regular user
   * its the organization that he belongs too, if the user is a master user its the organization he selected to
   * access its dashboard / pages
   */
  organizationId: number | null
}

interface LoginArgs {
  user: User
  bearerToken: string
  organizationId?: number | null
}

export const useAuthStore = defineStore('auth', {
  persist: true,

  state: (): AuthState => ({
    user: null,
    apiToken: null,
    organizationId: null,
  }),

  getters: {
    isLoggedIn: (state) => state.apiToken !== null,
    isMasterUser: (state) => !!state.user?.masterAccessLevel,
  },

  actions: {
    login({ bearerToken, organizationId, user }: LoginArgs) {
      this.user = user
      this.apiToken = bearerToken
      this.organizationId = organizationId ?? null
    },

    logOut() {
      this.user = null
      this.apiToken = null
      this.organizationId = null
    },
  },
})
