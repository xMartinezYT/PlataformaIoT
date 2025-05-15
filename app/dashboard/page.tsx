"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, TabletIcon as DeviceTablet, Loader2, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deviceService } from "@/lib/services/device-service"
import { notificationService } from "@/lib/services/notification-service"
import { DeviceStatusChart } from "@/components/dashboard/device-status-chart"
import { AlertSeverityChart } from "@/components/dashboard/alert-severity-chart"
import { ReadingsChart } from "@/components/dashboard/readings-chart"
import { DeviceList } from "@/components/devices/device-list"
import { AlertList } from "@/components/alerts/alert-list"
import { NotificationList } from "@/components/notifications/notification-list"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  const router = useRouter()

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch devices
        const devicesData = await deviceService.getUserDevices()
        setDevices(devicesData)

        // Calculate device status counts
        const statusCounts = devicesData.reduce((acc: any, device) => {
          acc[device.status] = (acc[device.status] || 0) + 1
          return acc
        }, {})

        const deviceStatusData = Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count: count as number,
        }))

        // Fetch active alerts
        let activeAlerts: any[] = []
        for (const device of devicesData) {
          try {
            const deviceAlerts = await deviceService.getDeviceAlerts(device.id, "ACTIVE")
            activeAlerts = [...activeAlerts, ...deviceAlerts]
          } catch (err) {
            console.error(`Error fetching alerts for device ${device.id}:`, err)
          }
        }

        setAlerts(activeAlerts)

        // Calculate alert severity counts
        const severityCounts = activeAlerts.reduce((acc: any, alert) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1
          return acc
        }, {})

        const alertSeverityData = Object.entries(severityCounts).map(([severity, count]) => ({
          severity,
          count: count as number,
        }))

        // Fetch notifications
        const notificationsData = await notificationService.getUserNotifications(undefined, 10)
        setNotifications(notificationsData)

        // Prepare readings data for chart
        const readingsData: any[] = []
        for (const device of devicesData.slice(0, 5)) {
          // Limit to 5 devices for performance
          try {
            const readings = await deviceService.getDeviceReadings(device.id, 50)

            // Group readings by type
            const readingsByType: Record<string, any[]> = {}
            readings.forEach((reading) => {
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
          totalDevices: devicesData.length,
          onlineDevices: devicesData.filter((d) => d.status === "ONLINE").length,
          totalAlerts: activeAlerts.length,
          resolvedAlerts: 0, // We'd need to fetch resolved alerts separately
        })

        setError(null)
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up real-time subscriptions
    const subscriptions: (() => void)[] = []

    // We'll add real-time subscriptions here after initial data load

    return () => {
      // Clean up subscriptions
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }, [])

  // Set up real-time subscriptions after initial data load
  useEffect(() => {
    if (!devices.length) return

    const subscriptions: (() => void)[] = []

    // Subscribe to device status changes
    devices.forEach((device) => {
      const unsubscribe = deviceService.subscribeToDeviceStatus(device.id, (status) => {
        setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, status } : d)))
      })
      subscriptions.push(unsubscribe)
    })

    // Subscribe to new alerts
    devices.forEach((device) => {
      const unsubscribe = deviceService.subscribeToDeviceAlerts(device.id, (alert) => {
        setAlerts((prev) => [alert, ...prev])
      })
      subscriptions.push(unsubscribe)
    })

    // Subscribe to new notifications
    const unsubscribeNotifications = notificationService.subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev])
    })
    subscriptions.push(unsubscribeNotifications)

    return () => {
      // Clean up subscriptions
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }, [devices])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando datos del dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push("/devices/new")}>Añadir Dispositivo</Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.totalDevices || 0}</span>
                <span className="text-xs text-muted-foreground">Total Dispositivos</span>
              </div>
              <div className="flex items-center space-x-1">
                <DeviceTablet className="h-8 w-8 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{dashboardData?.onlineDevices || 0}</span>
                  <span className="text-xs text-green-500">En línea</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.totalAlerts || 0}</span>
                <span className="text-xs text-muted-foreground">Alertas Activas</span>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispositivos Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{dashboardData?.onlineDevices || 0}</span>
                <span className="text-xs text-muted-foreground">Conectados</span>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dispositivos Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {(dashboardData?.totalDevices || 0) - (dashboardData?.onlineDevices || 0)}
                </span>
                <span className="text-xs text-muted-foreground">Desconectados</span>
              </div>
              <WifiOff className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different dashboard views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Device Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceStatusChart data={dashboardData?.deviceStatusData || []} />
              </CardContent>
            </Card>

            {/* Alert Severity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas por Severidad</CardTitle>
              </CardHeader>
              <CardContent>
                <AlertSeverityChart data={dashboardData?.alertSeverityData || []} />
              </CardContent>
            </Card>

            {/* Readings Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Lecturas de Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <ReadingsChart data={dashboardData?.readingsData || []} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertList alerts={alerts.slice(0, 5)} compact />
              {alerts.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setActiveTab("alerts")}>
                    Ver todas las alertas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Dispositivos</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceList devices={devices} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertList alerts={alerts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationList notifications={notifications} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
