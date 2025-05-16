"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowUpDown, Check, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos simulados para las alertas
const generateAlertsData = (deviceId: string) => {
  return [
    {
      id: "ALT-001",
      device: deviceId,
      type: "warning",
      message: "Temperatura elevada",
      value: "85°C",
      threshold: "80°C",
      time: "2023-05-05T10:23:00",
      acknowledged: false,
    },
    {
      id: "ALT-002",
      device: deviceId,
      type: "critical",
      message: "Pérdida de conexión",
      value: "N/A",
      threshold: "N/A",
      time: "2023-05-04T15:45:00",
      acknowledged: true,
    },
    {
      id: "ALT-003",
      device: deviceId,
      type: "warning",
      message: "Batería baja",
      value: "15%",
      threshold: "20%",
      time: "2023-05-03T08:12:00",
      acknowledged: true,
    },
    {
      id: "ALT-004",
      device: deviceId,
      type: "info",
      message: "Actualización de firmware disponible",
      value: "v2.3.1",
      threshold: "N/A",
      time: "2023-05-02T14:30:00",
      acknowledged: false,
    },
  ]
}

export default function DeviceAlerts({ deviceId }: { deviceId: string }) {
  const [alertsData, setAlertsData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simular carga de datos de alertas
    setAlertsData(generateAlertsData(deviceId))
  }, [deviceId])

  const filteredData = alertsData.filter(
    (alert) =>
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const acknowledgeAlert = (id: string) => {
    setAlertsData(alertsData.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Alertas del Dispositivo</CardTitle>
          <CardDescription>Historial de alertas y notificaciones</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                Ordenar
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Más recientes</DropdownMenuItem>
              <DropdownMenuItem>Más antiguos</DropdownMenuItem>
              <DropdownMenuItem>Criticidad (alta-baja)</DropdownMenuItem>
              <DropdownMenuItem>Criticidad (baja-alta)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar alertas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredData.map((alert) => (
            <Card
              key={alert.id}
              className={`border-l-4 ${
                alert.type === "critical"
                  ? "border-l-red-500"
                  : alert.type === "warning"
                    ? "border-l-yellow-500"
                    : "border-l-blue-500"
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {alert.type === "critical" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : alert.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {alert.message}
                  </CardTitle>
                  <CardDescription>ID: {alert.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={alert.acknowledged ? "outline" : "default"}
                    className={
                      alert.type === "critical"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : alert.type === "warning"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {alert.type === "critical" ? "Crítico" : alert.type === "warning" ? "Advertencia" : "Información"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Valor:</span>
                    <span>{alert.value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Umbral:</span>
                    <span>{alert.threshold}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.time).toLocaleString()}
                </div>
              </CardContent>
              {!alert.acknowledged && (
                <div className="px-6 pb-4">
                  <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                    <Check className="mr-1 h-3 w-3" />
                    Confirmar
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
