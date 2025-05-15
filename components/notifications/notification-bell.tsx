"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import { NotificationPanel } from "./notification-panel"

export function NotificationBell() {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Cargar el contador de notificaciones no leídas
  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount()
    }
  }, [session])

  // Actualizar el contador cada minuto
  useEffect(() => {
    if (!session?.user) return

    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notifications?status=UNREAD&limit=1")
      const data = await response.json()
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Error al obtener notificaciones no leídas:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleNotificationsRead = () => {
    // Actualizar el contador cuando se marcan notificaciones como leídas
    fetchUnreadCount()
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="relative rounded-full p-1 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ""}`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationPanel onClose={handleClose} onNotificationsRead={handleNotificationsRead} />}
    </div>
  )
}
