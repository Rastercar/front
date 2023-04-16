import { Token, User } from './types'

export interface ApiLoginResponse {
  user: User
  token: Token
}

export interface ApiSendEmailAddressConfirmationResponse {
  meta: {
    /**
     * The link to the PWA email confirmationPage
     */
    link: string
    /**
     * The short expiration token to be used to confirm the email
     */
    token: string
  }
}
