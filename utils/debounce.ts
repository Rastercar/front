export default function (fn: Function, wait = 250, immediate?: boolean) {
  let timeout: NodeJS.Timeout | undefined

  function debounced(this: any /* ...args */) {
    const args = arguments

    const later = () => {
      timeout = void 0
      if (immediate !== true) {
        fn.apply(this, args)
      }
    }

    clearTimeout(timeout)
    if (immediate === true && timeout === void 0) {
      fn.apply(this, args)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

  return debounced
}
