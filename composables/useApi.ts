import { useAuthStore } from '~~/store/auth.store'

export const useApi: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return useFetch(request, {
    baseURL: config.public.apiBaseUrl,
    headers: authStore.apiToken
      ? { Authorization: `Bearer ${authStore.apiToken}` }
      : {},
    ...opts,
  })
}
