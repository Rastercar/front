import { Organization, Token, User } from './types'

export interface ApiLoginResponse {
  // If the user that logged in is not a master user, its organization will be returned
  user: User & { organization?: Organization }
  token: Token
}

export interface SendEmailResponse {
  message: string
  emailUuid: string
}
