"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type WebSocketContextType = {
  isConnected: boolean
  lastMessage: any
  sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)

  useEffect(() => {
    // En un entorno real, conectaríamos a un WebSocket real
    // Para esta demo, simularemos la conexión y los mensajes

    console.log("Iniciando conexión WebSocket simulada...")

    // Simular conexión exitosa
    const timeoutId = setTimeout(() => {
      setIsConnected(true)
      console.log("WebSocket conectado")

      // Simular recepción de mensajes periódicos
      const intervalId = setInterval(() => {
        const deviceUpdates = {
          type: "deviceUpdates",
          timestamp: new Date().toISOString(),
          devices: [
            {
              id: "SEN-001",
              status: "online",
              lastReading: `${(20 + Math.random() * 8).toFixed(1)}°C`,
              batteryLevel: `${Math.floor(80 + Math.random() * 15)}%`,
            },
            {
              id: "MOT-103",
              status: Math.random() > 0.8 ? "warning" : "online",
              lastReading: `${Math.floor(70 + Math.random() * 10)} RPM`,
              batteryLevel: "N/A",
            },
          ],
        }

        setLastMessage(deviceUpdates)
      }, 5000)

      return () => {
        clearInterval(intervalId)
        setIsConnected(false)
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const sendMessage = (message: any) => {
    if (isConnected) {
      console.log("Mensaje enviado:", message)
      // En un entorno real, enviaríamos el mensaje al WebSocket
      // socket.send(JSON.stringify(message))
    }
  }

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>{children}</WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
