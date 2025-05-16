"use client"

import { useState } from "react"
import Link from "next/link"
import type { Device } from "@/lib/services/device-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, BarChart2, Settings, Wifi, WifiOff, AlertCircle } from "lucide-react"

interface DeviceCardProps {
  device: Device
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
            <AlertCircle className="h-3 w-3 mr-1" /> Error
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
    <Card className="w-full transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
          {getStatusIndicator()}
        </div>
        <p className="text-sm text-muted-foreground">S/N: {device.serial_number}</p>
        {device.location && <p className="text-xs text-muted-foreground mt-1">{device.location}</p>}
      </CardHeader>

      <CardContent className="pb-2">
        {device.last_reading_at ? (
          <div className="flex items-center space-x-1 text-sm">
            <Activity className="h-4 w-4 mr-1" />
            <span className="text-xs text-muted-foreground">
              Última lectura: {new Date(device.last_reading_at).toLocaleString()}
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin lecturas recientes</p>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{device.id.substring(0, 8)}...</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Modelo</span>
                <span>{device.model || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Fabricante</span>
                <span>{device.manufacturer || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Firmware</span>
                <span>{device.firmware_version || "N/A"}</span>
              </div>
              {device.last_maintenance && (
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-muted-foreground">Último mantenimiento</span>
                  <span>{new Date(device.last_maintenance).toLocaleDateString()}</span>
                </div>
              )}
              {device.description && (
                <div className="flex flex-col col-span-2">
                  <span className="text-xs text-muted-foreground">Descripción</span>
                  <span className="text-xs">{device.description}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Menos" : "Más"}
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/devices/${device.id}/readings`}>
              <BarChart2 className="h-4 w-4 mr-1" />
              Lecturas
            </Link>
          </Button>

          <Button variant="default" size="sm" asChild>
            <Link href={`/devices/${device.id}`}>Detalles</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
