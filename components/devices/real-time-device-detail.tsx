"use client"

import { useState } from "react"
import { useRealTimeDevice } from "@/hooks/use-real-time-device"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RealTimeReadingsChart } from "@/components/devices/real-time-readings-chart"
import { RealTimeAlertsList } from "@/components/devices/real-time-alerts-list"
import { Activity, AlertTriangle, Calendar, Clock, Info, MapPin, Settings, Wifi, WifiOff } from "lucide-react"

interface RealTimeDeviceDetailProps {
  deviceId: string
}

export function RealTimeDeviceDetail({ deviceId }: RealTimeDeviceDetailProps) {
  const { device, readings, alerts, loading, error } = useRealTimeDevice(deviceId)
  const [activeTab, setActiveTab] = useState("overview")

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load device data: {error.message}</AlertDescription>
      </Alert>
    )
  }

  if (!device) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The requested device could not be found.</AlertDescription>
      </Alert>
    )
  }

  // Status indicator
  const getStatusIndicator = () => {
    switch (device.status) {
      case "ONLINE":
        return (
          <Badge className="bg-green-500">
            <Wifi className="h-3 w-3 mr-1" /> Online
          </Badge>
        )
      case "OFFLINE":
        return (
          <Badge variant="destructive">
            <WifiOff className="h-3 w-3 mr-1" /> Offline
          </Badge>
        )
      case "MAINTENANCE":
        return (
          <Badge variant="warning" className="bg-yellow-500">
            <Settings className="h-3 w-3 mr-1" /> Maintenance
          </Badge>
        )
      case "ERROR":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Error
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="outline">
            <WifiOff className="h-3 w-3 mr-1" /> Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{device.status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{device.name}</h1>
          <p className="text-muted-foreground">Serial: {device.serial_number}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIndicator()}
          {device.last_reading_at && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Last update: {new Date(device.last_reading_at).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="readings">Readings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Device Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div className="grid grid-cols-3">
                    <dt className="font-medium text-muted-foreground">Model:</dt>
                    <dd className="col-span-2">{device.model || "N/A"}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="font-medium text-muted-foreground">Manufacturer:</dt>
                    <dd className="col-span-2">{device.manufacturer || "N/A"}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="font-medium text-muted-foreground">Firmware:</dt>
                    <dd className="col-span-2">{device.firmware_version || "N/A"}</dd>
                  </div>
                  {device.location && (
                    <div className="grid grid-cols-3">
                      <dt className="font-medium text-muted-foreground">Location:</dt>
                      <dd className="col-span-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {device.location}
                      </dd>
                    </div>
                  )}
                  {device.last_maintenance && (
                    <div className="grid grid-cols-3">
                      <dt className="font-medium text-muted-foreground">Last Maintenance:</dt>
                      <dd className="col-span-2 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(device.last_maintenance).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Readings (24h)</span>
                    </div>
                    <Badge variant="outline">
                      {readings.filter((r) => new Date(r.timestamp) > new Date(Date.now() - 86400000)).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Active Alerts</span>
                    </div>
                    <Badge variant="outline">
                      {alerts.filter((a) => a.status === "ACTIVE" || a.status === "ACKNOWLEDGED").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Uptime</span>
                    </div>
                    <Badge variant="outline">
                      {device.status === "ONLINE" ? "Active" : device.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {readings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Readings</CardTitle>
                <CardDescription>Last 24 hours of device activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <RealTimeReadingsChart readings={readings} />
                </div>
              </CardContent>
            </Card>
          )}

          {alerts.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest device alerts</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("alerts")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <RealTimeAlertsList alerts={alerts.slice(0, 3)} compact />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="readings">
          <Card>
            <CardHeader>
              <CardTitle>Device Readings</CardTitle>
              <CardDescription>Real-time and historical device readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <RealTimeReadingsChart readings={readings} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Device Alerts</CardTitle>
              <CardDescription>All alerts for this device</CardDescription>
            </CardHeader>
            <CardContent>
              <RealTimeAlertsList alerts={alerts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
