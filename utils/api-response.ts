/**
 * The default interface for the rastecar API errors
 */
interface ApiErrorResponse {
  error: string
  message: string | string[]
  statusCode: number
}

export const isApiErrorResponse = (
  response: unknown
): response is ApiErrorResponse => {
  const cast = response as ApiErrorResponse
  return !!(cast && cast.statusCode && cast.message)
}
