interface EmailEvent {
  emailUuid: string
}

interface UseEmailEventsOptions {
  disconnectOnUnmount: boolean
}

// creates a websocket connection to the api that will listen to the events of the
// email with the given uuid, event handlers can be registered with the returned
// callback registers
export const useEmailEvents = (
  emailUuid: string,
  options: UseEmailEventsOptions = { disconnectOnUnmount: false }
) => {
  const socket = useApiWebsocket('email')

  socket.on('connect', () => {
    socket.emit('listen-to-email-events', emailUuid)
  })

  const onSendingFinished = (handler: (data: EmailEvent) => void) => {
    socket.on('sending.finished', handler)
  }

  const onDelivery = (handler: (data: EmailEvent) => void) => {
    socket.on('email.delivery', handler)
  }

  if (options?.disconnectOnUnmount) onBeforeUnmount(() => socket.disconnect())

  return { socket, onSendingFinished, onDelivery }
}
