"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  Battery,
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  History,
  Power,
  RefreshCw,
  Settings,
  Thermometer,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DeviceHistoryChart from "@/components/device-history-chart"
import DeviceMaintenanceLog from "@/components/device-maintenance-log"
import DeviceAlerts from "@/components/device-alerts"
import DeviceMap from "@/components/device-map"

// Datos simulados del dispositivo
const deviceData = {
  "SEN-001": {
    id: "SEN-001",
    name: "Sensor de Temperatura A1",
    type: "Temperatura",
    model: "TS-2000",
    manufacturer: "TechSense",
    location: "Área de Producción",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    status: "online",
    lastReading: "24.5°C",
    lastUpdate: "2023-05-05T10:23:00",
    batteryLevel: "87%",
    firmware: "v2.3.1",
    installDate: "2022-08-15",
    maintenanceDate: "2023-02-10",
    ipAddress: "192.168.1.45",
    macAddress: "00:1B:44:11:3A:B7",
  },
  "MOT-103": {
    id: "MOT-103",
    name: "Motor Línea A",
    type: "Motor",
    model: "IM-5500",
    manufacturer: "InduMotors",
    location: "Línea de Producción A",
    coordinates: { lat: 41.3855, lng: 2.174 },
    status: "warning",
    lastReading: "75 RPM",
    lastUpdate: "2023-05-05T10:20:00",
    batteryLevel: "N/A",
    firmware: "v1.8.5",
    installDate: "2021-11-03",
    maintenanceDate: "2023-03-22",
    ipAddress: "192.168.1.62",
    macAddress: "00:1B:44:22:5C:D9",
  },
}

export default function DeviceDetailPage() {
  const { id } = useParams()
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos
    setLoading(true)
    setTimeout(() => {
      if (typeof id === "string" && deviceData[id]) {
        setDevice(deviceData[id])
      }
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Cargando información del dispositivo...</span>
        </div>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500" />
        <h1 className="text-2xl font-bold">Dispositivo no encontrado</h1>
        <p className="text-muted-foreground">El dispositivo con ID {id} no existe o no está disponible.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/devices" className="hover:text-foreground">
            Dispositivos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{device.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{device.name}</h1>
                  <Badge
                    variant="outline"
                    className={
                      device.status === "online"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : device.status === "warning"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {device.status === "online"
                      ? "Conectado"
                      : device.status === "warning"
                        ? "Advertencia"
                        : "Desconectado"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">ID: {device.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Power className="mr-2 h-4 w-4" />
                  Reiniciar
                </Button>
                <Button variant="destructive" size="sm">
                  Desactivar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Información General</h3>
                  <dl className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                    <dt className="text-muted-foreground">Tipo:</dt>
                    <dd>{device.type}</dd>
                    <dt className="text-muted-foreground">Modelo:</dt>
                    <dd>{device.model}</dd>
                    <dt className="text-muted-foreground">Fabricante:</dt>
                    <dd>{device.manufacturer}</dd>
                    <dt className="text-muted-foreground">Ubicación:</dt>
                    <dd>{device.location}</dd>
                    <dt className="text-muted-foreground">Última lectura:</dt>
                    <dd>{device.lastReading}</dd>
                    <dt className="text-muted-foreground">Última actualización:</dt>
                    <dd>{new Date(device.lastUpdate).toLocaleString()}</dd>
                  </dl>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Especificaciones Técnicas</h3>
                  <dl className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                    <dt className="text-muted-foreground">Firmware:</dt>
                    <dd>{device.firmware}</dd>
                    <dt className="text-muted-foreground">Batería:</dt>
                    <dd>{device.batteryLevel}</dd>
                    <dt className="text-muted-foreground">IP:</dt>
                    <dd>{device.ipAddress}</dd>
                    <dt className="text-muted-foreground">MAC:</dt>
                    <dd>{device.macAddress}</dd>
                    <dt className="text-muted-foreground">Instalación:</dt>
                    <dd>{new Date(device.installDate).toLocaleDateString()}</dd>
                    <dt className="text-muted-foreground">Último mantenimiento:</dt>
                    <dd>{new Date(device.maintenanceDate).toLocaleDateString()}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Conectividad</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={device.status === "online" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                  >
                    {device.status === "online" ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                {device.status === "online" && (
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "100%" }}></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Batería</span>
                  </div>
                  <span className="text-sm">{device.batteryLevel}</span>
                </div>
                {device.batteryLevel !== "N/A" && (
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: device.batteryLevel.replace("%", "") + "%" }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Temperatura</span>
                  </div>
                  <span className="text-sm">{device.type === "Temperatura" ? device.lastReading : "N/A"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tiempo de actividad</span>
                  </div>
                  <span className="text-sm">45 días, 8 horas</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Próximo mantenimiento</span>
                  </div>
                  <span className="text-sm">15/06/2023</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <History className="mr-2 h-4 w-4" />
                Ver historial completo
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="history">Historial</TabsTrigger>
              <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="location">Ubicación</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <DeviceHistoryChart deviceId={device.id} />
            </TabsContent>
            <TabsContent value="maintenance" className="mt-4">
              <DeviceMaintenanceLog deviceId={device.id} />
            </TabsContent>
            <TabsContent value="alerts" className="mt-4">
              <DeviceAlerts deviceId={device.id} />
            </TabsContent>
            <TabsContent value="location" className="mt-4">
              <DeviceMap device={device} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
