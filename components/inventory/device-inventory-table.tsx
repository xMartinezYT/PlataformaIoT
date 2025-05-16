"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const devices = [
  {
    id: "DEV-001",
    name: "Sensor de Temperatura A1",
    type: "Sensor",
    model: "TS-2000",
    manufacturer: "TechSense",
    location: "Área de Producción",
    status: "active",
    lastMaintenance: "10/02/2023",
    nextMaintenance: "10/08/2023",
  },
  {
    id: "DEV-002",
    name: "Motor Línea A",
    type: "Motor",
    model: "IM-5500",
    manufacturer: "InduMotors",
    location: "Línea de Producción A",
    status: "maintenance",
    lastMaintenance: "22/03/2023",
    nextMaintenance: "22/09/2023",
  },
  {
    id: "DEV-003",
    name: "Sensor de Humedad B2",
    type: "Sensor",
    model: "HS-1000",
    manufacturer: "TechSense",
    location: "Almacén",
    status: "active",
    lastMaintenance: "15/01/2023",
    nextMaintenance: "15/07/2023",
  },
  {
    id: "DEV-004",
    name: "Cámara de Seguridad 1",
    type: "Cámara",
    model: "SC-500",
    manufacturer: "SecureTech",
    location: "Entrada Principal",
    status: "inactive",
    lastMaintenance: "05/12/2022",
    nextMaintenance: "05/06/2023",
  },
  {
    id: "DEV-005",
    name: "Controlador PLC-1",
    type: "Controlador",
    model: "PLC-X200",
    manufacturer: "AutoControl",
    location: "Sala de Control",
    status: "active",
    lastMaintenance: "20/04/2023",
    nextMaintenance: "20/10/2023",
  },
  {
    id: "DEV-006",
    name: "Sensor de Presión C3",
    type: "Sensor",
    model: "PS-3000",
    manufacturer: "TechSense",
    location: "Compresores",
    status: "active",
    lastMaintenance: "08/03/2023",
    nextMaintenance: "08/09/2023",
  },
  {
    id: "DEV-007",
    name: "Motor Línea B",
    type: "Motor",
    model: "IM-5500",
    manufacturer: "InduMotors",
    location: "Línea de Producción B",
    status: "active",
    lastMaintenance: "12/02/2023",
    nextMaintenance: "12/08/2023",
  },
  {
    id: "DEV-008",
    name: "Sensor de Movimiento D4",
    type: "Sensor",
    model: "MS-100",
    manufacturer: "SecureTech",
    location: "Almacén",
    status: "inactive",
    lastMaintenance: "30/11/2022",
    nextMaintenance: "30/05/2023",
  },
]

interface DeviceInventoryTableProps {
  searchTerm?: string
  statusFilter?: "active" | "inactive" | "maintenance"
}

export default function DeviceInventoryTable({ searchTerm = "", statusFilter }: DeviceInventoryTableProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const filteredDevices = devices.filter((device) => {
    // Filtrar por término de búsqueda
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por estado si se proporciona
    const matchesStatus = statusFilter ? device.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(filteredDevices.map((device) => device.id))
    }
  }

  const toggleSelectDevice = (id: string) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter((deviceId) => deviceId !== id))
    } else {
      setSelectedDevices([...selectedDevices, id])
    }
  }

  return (
    <div>
      {selectedDevices.length > 0 && (
        <div className="bg-muted rounded-md p-2 mb-4 flex items-center justify-between">
          <span className="text-sm">
            {selectedDevices.length} {selectedDevices.length === 1 ? "dispositivo" : "dispositivos"} seleccionados
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Exportar Seleccionados
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Seleccionados
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último Mantenimiento</TableHead>
              <TableHead>Próximo Mantenimiento</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No se encontraron dispositivos.
                </TableCell>
              </TableRow>
            ) : (
              filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => toggleSelectDevice(device.id)}
                      aria-label={`Seleccionar ${device.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        device.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : device.status === "maintenance"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {device.status === "active"
                        ? "Activo"
                        : device.status === "maintenance"
                          ? "En Mantenimiento"
                          : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{device.lastMaintenance}</TableCell>
                  <TableCell>{device.nextMaintenance}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Programar mantenimiento</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
