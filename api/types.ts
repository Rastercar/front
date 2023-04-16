export interface Token {
  type: string
  value: string
}

export interface User {
  id: number
  createdAt: string
  updatedAt: string
  username: string
  lastLogin: string
  email: string
  emailVerified: boolean
  accessLevel: AccessLevel
  masterAccessLevel: AccessLevel
}

export interface UnregisteredUser {
  createdAt: string
  updatedAt: string
  username: string | null
  email: string | null
  emailVerified: boolean
  oauthProvider: string
}

export interface AccessLevel {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  description: string
  isFixed: boolean
  permissions: string[]
}
