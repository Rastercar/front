import { Token, User } from './types'

export interface ApiLoginResponse {
  user: User
  token: Token
}

export interface SendEmailResponse {
  message: string
  emailUuid: string
}
