"use client"

import { useState } from "react"
import { AlertTriangle, ArrowUpDown, Check, Clock, MoreHorizontal, Search, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: "ALT-001",
    device: "Motor Línea A",
    deviceId: "MOT-103",
    type: "warning",
    message: "Temperatura elevada",
    value: "85°C",
    threshold: "80°C",
    time: "10:23 AM",
    acknowledged: false,
  },
  {
    id: "ALT-002",
    device: "Compresor Principal",
    deviceId: "CMP-001",
    type: "critical",
    message: "Presión crítica",
    value: "9.8 bar",
    threshold: "9.0 bar",
    time: "09:45 AM",
    acknowledged: true,
  },
  {
    id: "ALT-003",
    device: "Sensor de Temperatura E5",
    deviceId: "SEN-008",
    type: "critical",
    message: "Fallo de conexión",
    value: "N/A",
    threshold: "N/A",
    time: "08:12 AM",
    acknowledged: false,
  },
  {
    id: "ALT-004",
    device: "Cinta Transportadora 2",
    deviceId: "CNT-002",
    type: "warning",
    message: "Velocidad reducida",
    value: "0.8 m/s",
    threshold: "1.0 m/s",
    time: "Ayer, 18:34 PM",
    acknowledged: true,
  },
  {
    id: "ALT-005",
    device: "Sensor de Humedad B2",
    deviceId: "SEN-002",
    type: "info",
    message: "Mantenimiento programado",
    value: "N/A",
    threshold: "N/A",
    time: "Ayer, 15:20 PM",
    acknowledged: true,
  },
]

export default function AlertsPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [alertsList, setAlertsList] = useState(alerts)

  const filteredAlerts = alertsList.filter(
    (alert) =>
      alert.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.deviceId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const acknowledgeAlert = (id: string) => {
    setAlertsList(alertsList.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
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
      <div className="grid gap-4">
        {filteredAlerts.map((alert) => (
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
                <CardDescription>
                  {alert.device} ({alert.deviceId})
                </CardDescription>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Ver dispositivo</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Silenciar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Valor:</span>
                  <span>{alert.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Umbral:</span>
                  <span>{alert.threshold}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.time}
              </div>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                  <Check className="mr-1 h-3 w-3" />
                  Confirmar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
