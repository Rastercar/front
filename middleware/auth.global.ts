export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (to.meta.requiredLoginStatus === 'loggedIn' && !auth.isLoggedIn) {
    return navigateTo('/auth/login')
  }

  if (to.meta.requiredLoginStatus === 'loggedOff' && auth.isLoggedIn) {
    return navigateTo('/')
  }
})
