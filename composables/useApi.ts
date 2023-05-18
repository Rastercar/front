import { merge } from 'lodash-es'

export const useApi: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const headers: NonNullable<typeof opts>['headers'] = {}

  if (auth.apiToken) headers['Authorization'] = `Bearer ${auth.apiToken}`

  const defaultOpts: NonNullable<typeof opts> = {
    baseURL: config.public.apiBaseUrl,
    headers,
  }

  return useFetch(request, merge(defaultOpts, opts))
}
