"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Datos simulados para el mantenimiento
const generateMaintenanceData = (deviceId: string) => {
  return [
    {
      id: "M001",
      date: "2023-03-15",
      type: "Preventivo",
      description: "Revisión general y limpieza",
      technician: "Carlos Rodríguez",
      status: "Completado",
    },
    {
      id: "M002",
      date: "2023-01-20",
      type: "Correctivo",
      description: "Reemplazo de sensor de temperatura",
      technician: "María López",
      status: "Completado",
    },
    {
      id: "M003",
      date: "2022-11-05",
      type: "Calibración",
      description: "Calibración de sensores",
      technician: "Juan Martínez",
      status: "Completado",
    },
    {
      id: "M004",
      date: "2022-08-12",
      type: "Preventivo",
      description: "Actualización de firmware",
      technician: "Ana García",
      status: "Completado",
    },
    {
      id: "M005",
      date: "2023-05-30",
      type: "Preventivo",
      description: "Revisión programada",
      technician: "Carlos Rodríguez",
      status: "Programado",
    },
  ]
}

export default function DeviceMaintenanceLog({ deviceId }: { deviceId: string }) {
  const [maintenanceData, setMaintenanceData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simular carga de datos de mantenimiento
    setMaintenanceData(generateMaintenanceData(deviceId))
  }, [deviceId])

  const filteredData = maintenanceData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Registro de Mantenimiento</CardTitle>
          <CardDescription>Historial de mantenimiento y próximas actividades programadas</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Programar Mantenimiento
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en el registro..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.technician}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "Completado"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
