const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('waited')
      resolve()
    }, ms)
  })

/**
 * wraps the provided fn into another one that will only resolve or
 * throw if a minimum time has elapsed
 */
export const withMinimumTime = async <T = unknown>(
  promise: Promise<T>,
  minimumMilliseconds: number
): Promise<T> => {
  const start = +new Date()

  const waitRemaining = async () => {
    const elapsedMs = +new Date() - start
    const remainingDelay = minimumMilliseconds - elapsedMs

    return wait(remainingDelay)
  }

  return promise
    .then(async (v) => {
      await waitRemaining()
      return v
    })
    .catch(async (e) => {
      await waitRemaining()
      throw e
    })
}
