"use client"

import { useState } from "react"
import Link from "next/link"
import type { Device } from "@/lib/services/device-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react"

interface DeviceListProps {
  devices: Device[]
}

export function DeviceList({ devices }: DeviceListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ONLINE":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "OFFLINE":
        return <WifiOff className="h-4 w-4 text-gray-500" />
      case "ERROR":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "MAINTENANCE":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE":
        return "bg-green-100 text-green-800"
      case "OFFLINE":
        return "bg-gray-100 text-gray-800"
      case "ERROR":
        return "bg-red-100 text-red-800"
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
          <p className="text-muted-foreground">Manage your IoT devices and monitor their status</p>
        </div>
        <Button asChild>
          <Link href="/devices/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Link>
        </Button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search devices..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDevices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No devices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Link href={`/devices/${device.id}`} key={device.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{device.name}</CardTitle>
                    <Badge className={getStatusColor(device.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(device.status)}
                        <span className="ml-1">{device.status}</span>
                      </span>
                    </Badge>
                  </div>
                  <CardDescription>SN: {device.serial_number}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{device.description || "No description"}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between text-xs text-muted-foreground">
                    <span>{device.location || "No location"}</span>
                    <span>
                      {device.last_reading_at ? new Date(device.last_reading_at).toLocaleString() : "No readings"}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
