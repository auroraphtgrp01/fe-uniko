'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter'

interface ISocketContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
}

const SocketContext = createContext<ISocketContext | null>(null)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

  useEffect(() => {
    const SOCKET_URL = `${process.env.NEXT_PUBLIC_BACKEND}`
    const socketInstance: Socket<DefaultEventsMap, DefaultEventsMap> = io(SOCKET_URL)
    socketInstance.on('connect', () => {})
    socketInstance.on('connect_error', (err) => {})
    setSocket(socketInstance)
    return () => {
      socketInstance.disconnect()
    }
  }, [])
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context.socket
}
