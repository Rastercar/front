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

  /**
   * if undefined the user is not linked to a google account
   */
  googleProfileId?: string

  /**
   * the access level for the client dashboard, if the user is a master user
   * this is the permissions this master user has when accessing a client org
   */
  accessLevel: AccessLevel

  /**
   * the access level for the tracker dashboard / actions,
   * if undefined the user is not a master user
   */
  masterAccessLevel?: AccessLevel
}

export interface Organization {
  id: number
  name: string
  blocked: boolean
  createdAt: string
  billingEmail: string
  billingEmailVerified: boolean
}

export interface UnregisteredUser {
  createdAt: string
  updatedAt: string
  username: string | null
  email: string | null
  emailVerified: boolean

  /**
   * eg: `google`, `facebook`
   */
  oauthProvider: string
}

export interface AccessLevel {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  description: string

  /**
   * if the access level cannot be deleted nor edited
   */
  isFixed: boolean

  /**
   * eg: `['create-user', 'send-alert']`
   */
  permissions: string[]
}

export interface Paginated<T = unknown> {
  records: T[]

  metadata: {
    total: number
    limit: number
    count: number
    offset: number
  }
}
