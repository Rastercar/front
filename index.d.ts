declare module '#app' {
  interface PageMeta {
    requiredLoginStatus?: 'loggedIn' | 'loggedOff'
  }
}

export {}
