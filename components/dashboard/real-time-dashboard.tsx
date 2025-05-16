"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RealTimeReadingsChart } from "@/components/devices/real-time-readings-chart"
import { RealTimeAlertsList } from "@/components/devices/real-time-alerts-list"
import { DeviceStatusChart } from "@/components/dashboard/device-status-chart"
import { AlertSeverityChart } from "@/components/dashboard/alert-severity-chart"
import { Activity, AlertTriangle, BarChart2, Loader2, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"

interface RealTimeDashboardProps {
  userId: string
}

export function RealTimeDashboard({ userId }: RealTimeDashboardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch initial data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch devices
        const { data: devicesData, error: devicesError } = await supabase
          .from("devices")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (devicesError) throw devicesError
        setDevices(devicesData || [])

        // Calculate device status counts
        const statusCounts: Record<string, number> = {}
        devicesData?.forEach((device) => {
          statusCounts[device.status] = (statusCounts[device.status] || 0) + 1
        })

        const deviceStatusData = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        }))

        // Fetch active alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from("device_alerts")
          .select("*, devices!inner(*)")
          .eq("devices.user_id", userId)
          .in("status", ["ACTIVE", "ACKNOWLEDGED"])
          .order("timestamp", { ascending: false })

        if (alertsError) throw alertsError
        setAlerts(alertsData || [])

        // Calculate alert severity counts
        const severityCounts: Record<string, number> = {}
        alertsData?.forEach((alert) => {
          severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1
        })

        const alertSeverityData = Object.entries(severityCounts).map(([severity, count]) => ({
          severity,
          count,
        }))

        // Fetch recent readings for each device (limit to 5 devices for performance)
        const readingsData: any[] = []
        for (const device of devicesData?.slice(0, 5) || []) {
          try {
            const { data: readings, error: readingsError } = await supabase
              .from("device_readings")
              .select("*")
              .eq("device_id", device.id)
              .order("timestamp", { ascending: false })
              .limit(50)

            if (readingsError) throw readingsError

            // Group readings by type
            const readingsByType: Record<string, any[]> = {}
            readings?.forEach((reading) => {
              if (!readingsByType[reading.type]) {
                readingsByType[reading.type] = []
              }
              readingsByType[reading.type].push({
                timestamp: reading.timestamp,
                value: reading.value,
                unit: reading.unit || "",
              })
            })

            if (Object.keys(readingsByType).length > 0) {
              readingsData.push({
                deviceId: device.id,
                deviceName: device.name,
                readings: readingsByType,
              })
            }
          } catch (err) {
            console.error(`Error fetching readings for device ${device.id}:`, err)
          }
        }

        setDashboardData({
          deviceStatusData,
          alertSeverityData,
          readingsData,
          totalDevices: devicesData?.length || 0,
          onlineDevices: devicesData?.filter((d) => d.status === "ONLINE").length || 0,
          totalAlerts: alertsData?.length || 0,
        })

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch dashboard data"))
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId])

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to device changes
    const deviceSubscription = supabase
      .channel("devices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "devices",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Device change:", payload)

          if (payload.eventType === "INSERT") {
            setDevices((prev) => [payload.new, ...prev])
            setDashboardData((prev: any) => ({
              ...prev,
              totalDevices: prev.totalDevices + 1,
              onlineDevices: payload.new.status === "ONLINE" ? prev.onlineDevices + 1 : prev.onlineDevices,
            }))
          } else if (payload.eventType === "UPDATE") {
            setDevices((prev) => prev.map((device) => (device.id === payload.new.id ? payload.new : device)))

            // Update online devices count if status changed
            if (payload.old.status !== payload.new.status) {
              setDashboardData((prev: any) => ({
                ...prev,
                onlineDevices:
                  payload.old.status === "ONLINE" && payload.new.status !== "ONLINE"
                    ? prev.onlineDevices - 1
                    : payload.old.status !== "ONLINE" && payload.new.status === "ONLINE"
                      ? prev.onlineDevices + 1
                      : prev.onlineDevices,
              }))
            }
          } else if (payload.eventType === "DELETE") {
            setDevices((prev) => prev.filter((device) => device.id !== payload.old.id))
            setDashboardData((prev: any) => ({
              ...prev,
              totalDevices: prev.totalDevices - 1,
              onlineDevices: payload.old.status === "ONLINE" ? prev.onlineDevices - 1 : prev.onlineDevices,
            }))
          }

          // Update device status data
          setDashboardData((prev: any) => {
            const devices =
              payload.eventType === "DELETE"
                ? prev.devices.filter((d: any) => d.id !== payload.old.id)
                : payload.eventType === "INSERT"
                  ? [...prev.devices, payload.new]
                  : prev.devices.map((d: any) => (d.id === payload.new.id ? payload.new : d))

            const statusCounts: Record<string, number> = {}
            devices.forEach((device: any) => {
              statusCounts[device.status] = (statusCounts[device.status] || 0) + 1
            })

            const deviceStatusData = Object.entries(statusCounts).map(([status, count]) => ({
              status,
              count,
            }))

            return {
              ...prev,
              deviceStatusData,
            }
          })
        },
      )
      .subscribe()

    // Subscribe to alert changes
    const alertSubscription = supabase
      .channel("alerts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "device_alerts",
        },
        async (payload) => {
          console.log("Alert change:", payload)

          // For inserts and updates, we need to check if the device belongs to the user
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            try {
              const { data: device } = await supabase
                .from("devices")
                .select("user_id")
                .eq("id", payload.new.device_id)
                .single()

              if (device?.user_id !== userId) return
            } catch (err) {
              console.error("Error checking device ownership:", err)
              return
            }
          }

          if (payload.eventType === "INSERT") {
            // Fetch the full alert with device data
            const { data: alertWithDevice } = await supabase
              .from("device_alerts")
              .select("*, devices(*)")
              .eq("id", payload.new.id)
              .single()

            if (alertWithDevice) {
              setAlerts((prev) => [alertWithDevice, ...prev])

              if (alertWithDevice.status === "ACTIVE" || alertWithDevice.status === "ACKNOWLEDGED") {
                setDashboardData((prev: any) => ({
                  ...prev,
                  totalAlerts: prev.totalAlerts + 1,
                }))
              }
            }
          } else if (payload.eventType === "UPDATE") {
            // Update the alert in the list
            setAlerts((prev) =>
              prev.map((alert) => (alert.id === payload.new.id ? { ...alert, ...payload.new } : alert)),
            )

            // Update alert count if status changed to or from ACTIVE/ACKNOWLEDGED
            const wasActive = payload.old.status === "ACTIVE" || payload.old.status === "ACKNOWLEDGED"
            const isActive = payload.new.status === "ACTIVE" || payload.new.status === "ACKNOWLEDGED"

            if (wasActive && !isActive) {
              setDashboardData((prev: any) => ({
                ...prev,
                totalAlerts: Math.max(0, prev.totalAlerts - 1),
              }))
            } else if (!wasActive && isActive) {
              setDashboardData((prev: any) => ({
                ...prev,
                totalAlerts: prev.totalAlerts + 1,
              }))
            }
          } else if (payload.eventType === "DELETE") {
            // Remove the alert from the list
            setAlerts((prev) => prev.filter((alert) => alert.id !== payload.old.id))

            // Update alert count if it was active
            if (payload.old.status === "ACTIVE" || payload.old.status === "ACKNOWLEDGED") {
              setDashboardData((prev: any) => ({
                ...prev,
                totalAlerts: Math.max(0, prev.totalAlerts - 1),
              }))
            }
          }

          // Update alert severity data
          setDashboardData((prev: any) => {
            const alerts =
              payload.eventType === "DELETE"
                ? prev.alerts.filter((a: any) => a.id !== payload.old.id)
                : payload.eventType === "INSERT"
                  ? [...prev.alerts, payload.new]
                  : prev.alerts.map((a: any) => (a.id === payload.new.id ? payload.new : a))

            const severityCounts: Record<string, number> = {}
            alerts
              .filter((a: any) => a.status === "ACTIVE" || a.status === "ACKNOWLEDGED")
              .forEach((alert: any) => {
                severityCounts[alert.severity] = (severityCounts[alert.severity] || 0) + 1
              })

            const alertSeverityData = Object.entries(severityCounts).map(([severity, count]) => ({
              severity,
              count,
            }))

            return {
              ...prev,
              alertSeverityData,
            }
          })
        },
      )
      .subscribe()

    // Subscribe to new readings
    const readingsSubscription = supabase
      .channel("readings-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "device_readings",
        },
        async (payload) => {
          console.log("New reading:", payload)

          // Check if the device belongs to the user
          try {
            const { data: device } = await supabase
              .from("devices")
              .select("id, name, user_id")
              .eq("id", payload.new.device_id)
              .single()

            if (device?.user_id !== userId) return

            // Update readings data
            setDashboardData((prev: any) => {
              if (!prev || !prev.readingsData) return prev

              // Find the device in readingsData
              const deviceIndex = prev.readingsData.findIndex((d: any) => d.deviceId === payload.new.device_id)

              if (deviceIndex === -1) {
                // If device not in readingsData (limited to 5), don't update
                if (prev.readingsData.length >= 5) return prev

                // Add new device to readingsData
                return {
                  ...prev,
                  readingsData: [
                    ...prev.readingsData,
                    {
                      deviceId: payload.new.device_id,
                      deviceName: device.name,
                      readings: {
                        [payload.new.type]: [
                          {
                            timestamp: payload.new.timestamp,
                            value: payload.new.value,
                            unit: payload.new.unit || "",
                          },
                        ],
                      },
                    },
                  ],
                }
              }

              // Update existing device readings
              const updatedReadingsData = [...prev.readingsData]
              const deviceData = { ...updatedReadingsData[deviceIndex] }

              if (!deviceData.readings[payload.new.type]) {
                deviceData.readings[payload.new.type] = []
              }

              deviceData.readings[payload.new.type] = [
                {
                  timestamp: payload.new.timestamp,
                  value: payload.new.value,
                  unit: payload.new.unit || "",
                },
                ...deviceData.readings[payload.new.type],
              ].slice(0, 50) // Limit to 50 readings per type

              updatedReadingsData[deviceIndex] = deviceData

              return {
                ...prev,
                readingsData: updatedReadingsData,
              }
            })
          } catch (err) {
            console.error("Error checking device ownership:", err)
          }
        },
      )
      .subscribe()

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(deviceSubscription)
      supabase.removeChannel(alertSubscription)
      supabase.removeChannel(readingsSubscription)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dashboard data: {error.message}</AlertDescription>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/devices/new">Add Device</Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.totalDevices || 0}</span>
                <span className="text-xs text-muted-foreground">Total Devices</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart2 className="h-8 w-8 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{dashboardData?.onlineDevices || 0}</span>
                  <span className="text-xs text-green-500">Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.totalAlerts || 0}</span>
                <span className="text-xs text-muted-foreground">Active Alerts</span>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Devices Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.onlineDevices || 0}</span>
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Devices Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {(dashboardData?.totalDevices || 0) - (dashboardData?.onlineDevices || 0)}
                </span>
                <span className="text-xs text-muted-foreground">Disconnected</span>
              </div>
              <WifiOff className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Device Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Device Status</CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceStatusChart data={dashboardData?.deviceStatusData || []} />
              </CardContent>
            </Card>

            {/* Alert Severity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts by Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertSeverityChart data={dashboardData?.alertSeverityData || []} />
              </CardContent>
            </Card>

            {/* Readings Chart */}
            {dashboardData?.readingsData?.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Device Readings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <RealTimeReadingsChart
                      readings={
                        dashboardData.readingsData[0]?.readings[
                          Object.keys(dashboardData.readingsData[0].readings)[0]
                        ] || []
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeAlertsList alerts={alerts.slice(0, 5)} compact />
                {alerts.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("alerts")}>
                      View all alerts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="devices" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any devices yet.</p>
                  <Button asChild>
                    <Link href="/devices/new">Add Your First Device</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device) => (
                    <Card key={device.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
                          {device.status === "ONLINE" ? (
                            <Badge className="bg-green-500">
                              <Wifi className="h-3 w-3 mr-1" /> Online
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <WifiOff className="h-3 w-3 mr-1" /> {device.status}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>S/N: {device.serial_number}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {device.last_reading_at ? (
                          <div className="flex items-center space-x-1 text-sm">
                            <Activity className="h-4 w-4 mr-1" />
                            <span className="text-xs text-muted-foreground">
                              Last reading: {new Date(device.last_reading_at).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No recent readings</p>
                        )}
                      </CardContent>
                      <div className="p-4 pt-0 flex justify-end">
                        <Button variant="default" size="sm" asChild>
                          <Link href={`/devices/${device.id}`}>Details</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active alerts at this time.</p>
                </div>
              ) : (
                <RealTimeAlertsList alerts={alerts} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
