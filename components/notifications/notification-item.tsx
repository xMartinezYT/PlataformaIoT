"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { AlertTriangle, Bell, Clock, Cpu, Shield, Check, Trash2, MoreVertical } from "lucide-react"

interface NotificationItemProps {
  notification: {
    id: string
    title: string
    message: string
    type: string
    status: string
    link: string | null
    createdAt: string
    readAt: string | null
  }
  onUpdate: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onUpdate, onDelete }: NotificationItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getIcon = () => {
    switch (notification.type) {
      case "ALERT":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "MAINTENANCE":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "DEVICE_STATUS":
        return <Cpu className="h-5 w-5 text-blue-500" />
      case "SECURITY":
        return <Shield className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "READ" }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar notificación")
      }

      onUpdate(notification.id, "READ")
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error al marcar como leída:", error)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/notifications/${notification.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar notificación")
      }

      onDelete(notification.id)
    } catch (error) {
      console.error("Error al eliminar notificación:", error)
      setIsDeleting(false)
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Determinar si la notificación está leída
  const isRead = notification.status === "READ"

  // Contenido de la notificación
  const content = (
    <div className={`relative flex p-4 ${isRead ? "bg-white" : "bg-blue-50"}`}>
      <div className="mr-3 flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className={`text-sm font-medium ${isRead ? "text-gray-900" : "text-blue-900"}`}>{notification.title}</p>
          <div className="relative ml-2">
            <button
              onClick={toggleMenu}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Opciones de notificación"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {!isRead && (
                    <button
                      onClick={handleMarkAsRead}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como leída
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
        </p>
      </div>
    </div>
  )

  // Si hay un enlace, envolver en un Link
  if (notification.link) {
    return (
      <li>
        <Link
          href={notification.link}
          className="block hover:bg-gray-50"
          onClick={() => {
            // Marcar como leída automáticamente al hacer clic
            if (!isRead) {
              handleMarkAsRead()
            }
          }}
        >
          {content}
        </Link>
      </li>
    )
  }

  // Si no hay enlace, mostrar sin Link
  return <li>{content}</li>
}
