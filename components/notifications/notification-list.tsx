"use client"

import { useState } from "react"
import type { Notification } from "@/lib/services/notification-service"
import { NotificationItem } from "@/components/notifications/notification-item"
import { Button } from "@/components/ui/button"
import { notificationService } from "@/lib/services/notification-service"

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>(notifications)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setIsMarkingAllRead(true)
    try {
      await notificationService.markAllAsRead()
      setCurrentNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: "READ",
          read_at: new Date().toISOString(),
        })),
      )
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  // Handle notification update
  const handleNotificationUpdate = (updatedNotification: Notification) => {
    setCurrentNotifications((prev) =>
      prev.map((notification) => (notification.id === updatedNotification.id ? updatedNotification : notification)),
    )
  }

  // Handle notification delete
  const handleNotificationDelete = (id: string) => {
    setCurrentNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Check if there are unread notifications
  const hasUnreadNotifications = currentNotifications.some((notification) => notification.status === "UNREAD")

  return (
    <div className="space-y-4">
      {/* Actions */}
      {currentNotifications.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{currentNotifications.length} notificación(es)</p>
          {hasUnreadNotifications && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={isMarkingAllRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
      )}

      {/* Notification list */}
      {currentNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No hay notificaciones</p>
          <p className="text-sm text-muted-foreground">No tienes notificaciones en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onUpdate={handleNotificationUpdate}
              onDelete={handleNotificationDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
