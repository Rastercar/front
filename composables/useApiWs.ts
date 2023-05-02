import { ManagerOptions, SocketOptions, io } from 'socket.io-client'

export const useApiWebsocket = (
  path: string,
  opts?: Partial<ManagerOptions & SocketOptions>
) => {
  const config = useRuntimeConfig()

  const uri = config.public.apiBaseUrl + path

  return io(uri, opts)
}
