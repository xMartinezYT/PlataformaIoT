"use client"

import { useState } from "react"
import { useRealTimeNotifications } from "@/hooks/use-real-time-notifications"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface RealTimeNotificationBellProps {
  userId: string
}

export function RealTimeNotificationBell({ userId }: RealTimeNotificationBellProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useRealTimeNotifications(userId)
  const [open, setOpen] = useState(false)

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => {
                markAllAsRead()
                setOpen(false)
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 ${notification.status === "UNREAD" ? "bg-muted/20" : ""}`}
                >
                  <Link
                    href={notification.link || "#"}
                    onClick={() => {
                      if (notification.status === "UNREAD") {
                        markAsRead(notification.id)
                      }
                      setOpen(false)
                    }}
                    className="block"
                  >
                    <div className="text-sm font-medium">{notification.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        {notifications.length > 10 && (
          <div className="p-2 border-t text-center">
            <Link
              href="/notifications"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
