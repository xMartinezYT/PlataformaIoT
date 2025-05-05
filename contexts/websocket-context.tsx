"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  subscribeToDevice: (deviceId: string) => void
  unsubscribeFromDevice: (deviceId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  subscribeToDevice: () => {},
  unsubscribeFromDevice: () => {},
})

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io({
      path: "/api/socket",
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const subscribeToDevice = (deviceId: string) => {
    if (socket && isConnected) {
      socket.emit("join-device", deviceId)
    }
  }

  const unsubscribeFromDevice = (deviceId: string) => {
    if (socket && isConnected) {
      socket.emit("leave-device", deviceId)
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        subscribeToDevice,
        unsubscribeFromDevice,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}
