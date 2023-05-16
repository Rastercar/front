import { merge } from 'lodash-es'
import { useAuthStore } from '~~/store/auth.store'

export const useApi: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const headers: NonNullable<typeof opts>['headers'] = {}

  if (auth.apiToken) headers['Authorization'] = `Bearer ${auth.apiToken}`
  if (auth.organizationId) headers['Organization-Id'] = `${auth.organizationId}`

  const defaultOpts: NonNullable<typeof opts> = {
    baseURL: config.public.apiBaseUrl,
    headers,
  }

  return useFetch(request, merge(defaultOpts, opts))
}
