import { defineStore } from 'pinia'
import { Organization, User } from '~~/api/types'

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
  organization: Organization | null
}

interface LoginArgs {
  user: User
  bearerToken: string
  organization?: Organization | null
}

export const useAuthStore = defineStore('auth', {
  persist: true,

  state: (): AuthState => ({
    user: null,
    apiToken: null,
    organization: null,
  }),

  getters: {
    isLoggedIn: (state) => state.apiToken !== null,
    isMasterUser: (state) => !!state.user?.masterAccessLevel,
  },

  actions: {
    logIn({ bearerToken, organization, user }: LoginArgs) {
      this.user = user
      this.apiToken = bearerToken
      this.organization = organization ?? null

      console.log(this.organization)
    },

    logOut() {
      this.user = null
      this.apiToken = null
      this.organization = null
    },

    setUserEmailVerified(emailVerified: boolean) {
      if (this.user) this.user.emailVerified = emailVerified
    },
  },
})
