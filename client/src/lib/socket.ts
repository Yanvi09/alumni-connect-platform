import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function connectSocket(userId: string) {
  if (!userId) return null
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    auth: { userId },
  })

  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  if (!socket) return
  socket.disconnect()
  socket = null
}
