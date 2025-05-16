"use client"

import { useState } from "react"
import { useDeviceControl } from "@/hooks/use-device-control"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Power, RefreshCw, Download, Settings, Sliders } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeviceControlPanelProps {
  deviceId: string
  deviceName: string
  deviceStatus: string
  deviceType?: string
}

export function DeviceControlPanel({
  deviceId,
  deviceName,
  deviceStatus,
  deviceType = "generic",
}: DeviceControlPanelProps) {
  const { isLoading, powerToggle, restart, update, configure, calibrate } = useDeviceControl({ deviceId })

  const [firmwareVersion, setFirmwareVersion] = useState<string>("latest")
  const [brightness, setBrightness] = useState<number>(50)
  const [interval, setInterval] = useState<number>(60)
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true)

  const handleUpdateFirmware = () => {
    update(firmwareVersion)
  }

  const handleSaveSettings = () => {
    configure({
      brightness,
      interval,
      enableNotifications,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return "bg-green-500"
      case "OFFLINE":
        return "bg-gray-500"
      case "ERROR":
        return "bg-red-500"
      case "WARNING":
        return "bg-yellow-500"
      case "UPDATING":
        return "bg-blue-500"
      case "RESTARTING":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{deviceName}</CardTitle>
            <CardDescription>Device Control Panel</CardDescription>
          </div>
          <Badge className={`${getStatusColor(deviceStatus)} text-white`}>{deviceStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="firmware">Firmware</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={powerToggle} disabled={isLoading} variant="outline" className="h-24">
                <div className="flex flex-col items-center gap-2">
                  <Power className={deviceStatus.toUpperCase() === "ONLINE" ? "text-green-500" : "text-gray-500"} />
                  <span>{deviceStatus.toUpperCase() === "ONLINE" ? "Turn Off" : "Turn On"}</span>
                </div>
              </Button>

              <Button
                onClick={restart}
                disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                variant="outline"
                className="h-24"
              >
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw />
                  <span>Restart Device</span>
                </div>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="firmware" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firmware-version">Firmware Version</Label>
                <Input
                  id="firmware-version"
                  placeholder="latest"
                  value={firmwareVersion}
                  onChange={(e) => setFirmwareVersion(e.target.value)}
                />
              </div>

              <Button
                onClick={handleUpdateFirmware}
                disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Update Firmware
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brightness">Brightness ({brightness}%)</Label>
                <Slider
                  id="brightness"
                  min={0}
                  max={100}
                  step={1}
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Update Interval ({interval} seconds)</Label>
                <Slider
                  id="interval"
                  min={5}
                  max={300}
                  step={5}
                  value={[interval]}
                  onValueChange={(value) => setInterval(value[0])}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                className="w-full"
              >
                <Settings className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calibration" className="space-y-4 pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Calibration helps ensure your device readings are accurate. Select a sensor to calibrate or calibrate
                all sensors at once.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => calibrate("temperature")}
                  disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                  variant="outline"
                >
                  Calibrate Temperature
                </Button>

                <Button
                  onClick={() => calibrate("humidity")}
                  disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                  variant="outline"
                >
                  Calibrate Humidity
                </Button>

                <Button
                  onClick={() => calibrate("pressure")}
                  disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                  variant="outline"
                >
                  Calibrate Pressure
                </Button>

                <Button
                  onClick={() => calibrate("light")}
                  disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                  variant="outline"
                >
                  Calibrate Light
                </Button>
              </div>

              <Button
                onClick={() => calibrate()}
                disabled={isLoading || deviceStatus.toUpperCase() !== "ONLINE"}
                className="w-full"
              >
                <Sliders className="mr-2 h-4 w-4" />
                Calibrate All Sensors
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {isLoading ? "Processing command..." : "Ready for commands"}
      </CardFooter>
    </Card>
  )
}
