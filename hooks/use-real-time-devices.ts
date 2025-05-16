"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Device } from "@/types/supabase"

export function useRealTimeDevices(userId: string) {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from("devices")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        setDevices(data || [])
      } catch (err) {
        console.error("Error fetching devices:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch devices"))
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [userId])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel(`devices-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "devices",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Device added:", payload)
          setDevices((prevDevices) => [payload.new as Device, ...prevDevices])
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "devices",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Device updated:", payload)
          setDevices((prevDevices) =>
            prevDevices.map((device) => (device.id === payload.new.id ? (payload.new as Device) : device)),
          )
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "devices",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Device deleted:", payload)
          setDevices((prevDevices) => prevDevices.filter((device) => device.id !== payload.old.id))
        },
      )
      .subscribe()

    // Clean up subscription
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  return { devices, loading, error }
}
