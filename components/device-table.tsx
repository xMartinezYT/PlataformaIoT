"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Search,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useWebSocket } from "@/contexts/websocket-context"

const devices = [
  {
    id: "SEN-001",
    name: "Sensor de Temperatura A1",
    type: "Temperatura",
    location: "Área de Producción",
    status: "online",
    lastReading: "24.5°C",
    lastUpdate: "Hace 2 min",
  },
  {
    id: "SEN-002",
    name: "Sensor de Humedad B2",
    type: "Humedad",
    location: "Almacén",
    status: "online",
    lastReading: "48%",
    lastUpdate: "Hace 5 min",
  },
  {
    id: "MOT-103",
    name: "Motor Línea A",
    type: "Motor",
    location: "Línea de Producción A",
    status: "warning",
    lastReading: "75 RPM",
    lastUpdate: "Hace 3 min",
  },
  {
    id: "SEN-004",
    name: "Sensor de Presión C3",
    type: "Presión",
    location: "Compresores",
    status: "online",
    lastReading: "4.2 bar",
    lastUpdate: "Hace 1 min",
  },
  {
    id: "CAM-005",
    name: "Cámara de Seguridad 1",
    type: "Cámara",
    location: "Entrada Principal",
    status: "offline",
    lastReading: "N/A",
    lastUpdate: "Hace 2 horas",
  },
  {
    id: "SEN-006",
    name: "Sensor de Movimiento D4",
    type: "Movimiento",
    location: "Almacén",
    status: "offline",
    lastReading: "N/A",
    lastUpdate: "Hace 1 hora",
  },
  {
    id: "MOT-107",
    name: "Motor Línea B",
    type: "Motor",
    location: "Línea de Producción B",
    status: "online",
    lastReading: "80 RPM",
    lastUpdate: "Hace 2 min",
  },
  {
    id: "SEN-008",
    name: "Sensor de Temperatura E5",
    type: "Temperatura",
    location: "Área de Enfriamiento",
    status: "online",
    lastReading: "18.2°C",
    lastUpdate: "Hace 4 min",
  },
]

export default function DeviceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [devicesList, setDevicesList] = useState(devices)
  const { lastMessage } = useWebSocket()

  // Actualizar datos de dispositivos en tiempo real
  useEffect(() => {
    if (lastMessage && lastMessage.type === "deviceUpdates") {
      const updates = lastMessage.devices

      // Actualizar la lista de dispositivos con los nuevos datos
      setDevicesList((prevDevices) => {
        return prevDevices.map((device) => {
          const update = updates.find((u: any) => u.id === device.id)
          if (update) {
            return {
              ...device,
              status: update.status,
              lastReading: update.lastReading,
              lastUpdate: "Ahora",
            }
          }
          return device
        })
      })
    }
  }, [lastMessage])

  const filteredDevices = devicesList.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar dispositivos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              Filtrar
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Todos los dispositivos</DropdownMenuItem>
            <DropdownMenuItem>Solo activos</DropdownMenuItem>
            <DropdownMenuItem>Con alertas</DropdownMenuItem>
            <DropdownMenuItem>Desconectados</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sensores</DropdownMenuItem>
            <DropdownMenuItem>Motores</DropdownMenuItem>
            <DropdownMenuItem>Cámaras</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Lectura</TableHead>
              <TableHead>Actualizado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {device.type === "Temperatura" ? (
                      <Thermometer className="h-4 w-4 text-orange-500" />
                    ) : device.type === "Motor" ? (
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-500" />
                    )}
                    {device.name}
                  </div>
                </TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {device.status === "online" ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Conectado
                        </Badge>
                      </>
                    ) : device.status === "warning" ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Advertencia
                        </Badge>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Desconectado
                        </Badge>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{device.lastReading}</TableCell>
                <TableCell className="text-muted-foreground">{device.lastUpdate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/devices/${device.id}`} className="flex items-center">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Historial</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Reiniciar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
