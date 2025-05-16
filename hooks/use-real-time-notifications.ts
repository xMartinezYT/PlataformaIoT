"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export function useRealTimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)

        // Fetch notifications
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications(data || [])

        // Count unread notifications
        const unread = data?.filter((notification) => notification.status === "UNREAD").length || 0
        setUnreadCount(unread)
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch notifications"))
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [userId])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("New notification:", payload)
          setNotifications((prevNotifications) => [payload.new, ...prevNotifications].slice(0, 50))
          if (payload.new.status === "UNREAD") {
            setUnreadCount((prevCount) => prevCount + 1)
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Notification updated:", payload)
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => (notification.id === payload.new.id ? payload.new : notification)),
          )

          // Update unread count if status changed
          if (payload.old.status === "UNREAD" && payload.new.status !== "UNREAD") {
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1))
          } else if (payload.old.status !== "UNREAD" && payload.new.status === "UNREAD") {
            setUnreadCount((prevCount) => prevCount + 1)
          }
        },
      )
      .subscribe()

    // Clean up subscription
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  // Function to mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: "READ", read_at: new Date().toISOString() })
        .eq("id", notificationId)

      if (error) throw error
    } catch (err) {
      console.error("Error marking notification as read:", err)
      throw err
    }
  }

  // Function to mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: "READ", read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("status", "UNREAD")

      if (error) throw error
      setUnreadCount(0)
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      throw err
    }
  }

  return { notifications, unreadCount, loading, error, markAsRead, markAllAsRead }
}
