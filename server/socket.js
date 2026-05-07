import { Server } from 'socket.io'

let ioInstance = null

export function initSocket(httpServer, clientOrigin) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  })

  ioInstance.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId
    if (userId && typeof userId === 'string') {
      socket.join(`user:${userId}`)
    }
  })

  return ioInstance
}

export function emitToUser(userId, event, payload) {
  if (!ioInstance || !userId) return
  ioInstance.to(`user:${userId}`).emit(event, payload)
}
