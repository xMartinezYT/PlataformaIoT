"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

const automationHistory = [
  {
    id: "event-001",
    ruleName: "Alerta de temperatura alta",
    device: "Motor Línea A",
    trigger: "Temperatura > 80°C (85.2°C)",
    action: "Enviar alerta por email y SMS",
    status: "success",
    timestamp: "05/05/2023 10:23:45",
  },
  {
    id: "event-002",
    ruleName: "Alerta de temperatura alta",
    device: "Motor Línea B",
    trigger: "Temperatura > 80°C (82.7°C)",
    action: "Enviar alerta por email y SMS",
    status: "success",
    timestamp: "04/05/2023 15:12:32",
  },
  {
    id: "event-003",
    ruleName: "Alerta de batería baja",
    device: "Sensor de Humedad B2",
    trigger: "Nivel de batería < 20% (18%)",
    action: "Enviar alerta por email",
    status: "success",
    timestamp: "03/05/2023 08:45:11",
  },
  {
    id: "event-004",
    ruleName: "Apagado automático",
    device: "Motor Línea C",
    trigger: "Temperatura > 95°C (97.1°C)",
    action: "Apagar dispositivo",
    status: "failed",
    timestamp: "02/05/2023 14:22:05",
  },
  {
    id: "event-005",
    ruleName: "Reporte diario de producción",
    device: "Sistema",
    trigger: "Programado - 23:00",
    action: "Generar reporte y enviar por email",
    status: "success",
    timestamp: "01/05/2023 23:00:00",
  },
  {
    id: "event-006",
    ruleName: "Notificación de mantenimiento",
    device: "Compresor C-103",
    trigger: "Horas de operación > 5000 (5012h)",
    action: "Crear tarea de mantenimiento",
    status: "success",
    timestamp: "28/04/2023 09:15:22",
  },
]

export default function AutomationHistory() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = automationHistory.filter(
    (event) =>
      event.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Automatizaciones</CardTitle>
        <CardDescription>Registro de ejecuciones de reglas de automatización</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en el historial..."
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
                <TableHead>Regla</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Disparador</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha y Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.ruleName}</TableCell>
                  <TableCell>{event.device}</TableCell>
                  <TableCell>{event.trigger}</TableCell>
                  <TableCell>{event.action}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        event.status === "success"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {event.status === "success" ? "Exitoso" : "Fallido"}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
