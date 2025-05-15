"use client"

import { useState } from "react"
import Link from "next/link"
import type { Notification } from "@/lib/services/notification-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, Check, Clock, Cpu, Shield, Trash2, ExternalLink } from "lucide-react"
import { notificationService } from "@/lib/services/notification-service"

interface NotificationItemProps {
  notification: Notification
  onUpdate: (notification: Notification) => void
  onDelete: (id: string) => void
}

export function NotificationItem({ notification, onUpdate, onDelete }: NotificationItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get notification icon based on type
  const getNotificationIcon = () => {
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

  // Mark notification as read
  const markAsRead = async () => {
    if (notification.status === "READ") return

    setIsUpdating(true)
    try {
      const updatedNotification = await notificationService.markAsRead(notification.id)
      onUpdate(updatedNotification)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete notification
  const deleteNotification = async () => {
    setIsDeleting(true)
    try {
      await notificationService.deleteNotification(notification.id)
      onDelete(notification.id)
    } catch (error) {
      console.error("Error deleting notification:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle click on notification
  const handleClick = () => {
    markAsRead()
  }

  const content = (
    <div className="flex">
      <div className="mr-4 flex-shrink-0 self-start pt-1">{getNotificationIcon()}</div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className={`font-medium ${notification.status === "UNREAD" ? "text-black" : "text-gray-700"}`}>
              {notification.title}
            </p>
            <p className={`mt-1 text-sm ${notification.status === "UNREAD" ? "text-gray-700" : "text-gray-500"}`}>
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div>
            {notification.status === "UNREAD" && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Nueva
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {notification.status === "UNREAD" && (
              <Button variant="ghost" size="sm" onClick={markAsRead} disabled={isUpdating} className="h-8 px-2 text-xs">
                <Check className="h-3.5 w-3.5 mr-1" />
                Marcar como leída
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteNotification}
              disabled={isDeleting}
              className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Card
      className={`${notification.status === "UNREAD" ? "bg-blue-50" : "bg-white"} hover:shadow-md transition-shadow`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {notification.link ? (
          <Link href={notification.link} className="block">
            {content}
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-blue-500 flex items-center">
                Ver detalles <ExternalLink className="h-3 w-3 ml-1" />
              </span>
            </div>
          </Link>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  )
}
