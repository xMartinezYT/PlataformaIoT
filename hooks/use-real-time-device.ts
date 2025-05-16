"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Device } from "@/types/supabase"

export function useRealTimeDevice(deviceId: string) {
  const [device, setDevice] = useState<Device | null>(null)
  const [readings, setReadings] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch device details
        const { data: deviceData, error: deviceError } = await supabase
          .from("devices")
          .select("*")
          .eq("id", deviceId)
          .single()

        if (deviceError) throw deviceError
        setDevice(deviceData)

        // Fetch recent readings
        const { data: readingsData, error: readingsError } = await supabase
          .from("device_readings")
          .select("*")
          .eq("device_id", deviceId)
          .order("timestamp", { ascending: false })
          .limit(100)

        if (readingsError) throw readingsError
        setReadings(readingsData)

        // Fetch active alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from("device_alerts")
          .select("*")
          .eq("device_id", deviceId)
          .order("timestamp", { ascending: false })
          .limit(20)

        if (alertsError) throw alertsError
        setAlerts(alertsData)
      } catch (err) {
        console.error("Error fetching device data:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch device data"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [deviceId])

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to device changes
    const deviceSubscription = supabase
      .channel(`device-${deviceId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "devices",
          filter: `id=eq.${deviceId}`,
        },
        (payload) => {
          console.log("Device updated:", payload)
          setDevice(payload.new as Device)
        },
      )
      .subscribe()

    // Subscribe to new readings
    const readingsSubscription = supabase
      .channel(`readings-${deviceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "device_readings",
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          console.log("New reading:", payload)
          setReadings((prevReadings) => [payload.new, ...prevReadings].slice(0, 100))
        },
      )
      .subscribe()

    // Subscribe to new alerts
    const alertsSubscription = supabase
      .channel(`alerts-${deviceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "device_alerts",
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          console.log("New alert:", payload)
          setAlerts((prevAlerts) => [payload.new, ...prevAlerts].slice(0, 20))
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "device_alerts",
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          console.log("Alert updated:", payload)
          setAlerts((prevAlerts) => prevAlerts.map((alert) => (alert.id === payload.new.id ? payload.new : alert)))
        },
      )
      .subscribe()

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(deviceSubscription)
      supabase.removeChannel(readingsSubscription)
      supabase.removeChannel(alertsSubscription)
    }
  }, [deviceId])

  return { device, readings, alerts, loading, error }
}
