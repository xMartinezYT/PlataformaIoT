"use client"

import { useState, useEffect, useRef } from "react"
import { X, Bell, Check } from "lucide-react"
import { NotificationItem } from "./notification-item"

interface NotificationPanelProps {
  onClose: () => void
  onNotificationsRead: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: string
  link: string | null
  createdAt: string
  readAt: string | null
}

export function NotificationPanel({ onClose, onNotificationsRead }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Cargar notificaciones
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notifications?limit=20")

      if (!response.ok) {
        throw new Error("Error al cargar notificaciones")
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error al obtener notificaciones:", error)
      setError("No se pudieron cargar las notificaciones")
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.status === "UNREAD")

      if (unreadNotifications.length === 0) return

      // Actualizar localmente primero para UI responsiva
      setNotifications((prev) =>
        prev.map((n) => (n.status === "UNREAD" ? { ...n, status: "READ", readAt: new Date().toISOString() } : n)),
      )

      // Actualizar en el servidor
      const updatePromises = unreadNotifications.map((notification) =>
        fetch(`/api/notifications/${notification.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "READ" }),
        }),
      )

      await Promise.all(updatePromises)
      onNotificationsRead()
    } catch (error) {
      console.error("Error al marcar notificaciones como leídas:", error)
      // Revertir cambios locales en caso de error
      fetchNotifications()
    }
  }

  const handleNotificationUpdate = (id: string, status: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, readAt: status === "READ" ? new Date().toISOString() : n.readAt } : n,
      ),
    )
    onNotificationsRead()
  }

  const handleNotificationDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    onNotificationsRead()
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:w-96"
      style={{ zIndex: 50 }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          aria-label="Cerrar panel de notificaciones"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1">
        <button
          onClick={markAllAsRead}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          disabled={!notifications.some((n) => n.status === "UNREAD")}
        >
          <Check className="mr-1 h-4 w-4" />
          Marcar todas como leídas
        </button>
        <button onClick={fetchNotifications} className="text-sm text-gray-600 hover:text-gray-800">
          Actualizar
        </button>
      </div>

      <div className="max-h-[calc(80vh-6rem)] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando notificaciones...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
            <Bell className="mb-2 h-8 w-8 text-gray-400" />
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onUpdate={handleNotificationUpdate}
                onDelete={handleNotificationDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
