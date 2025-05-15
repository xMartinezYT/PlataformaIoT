"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, PenToolIcon as Tool } from "lucide-react"

export default function MaintenancePrediction() {
  const maintenancePredictions = [
    {
      id: "DEV-001",
      device: "Motor Línea A",
      component: "Rodamiento principal",
      probability: 87,
      estimatedFailure: "15/06/2023",
      timeRemaining: "12 días",
      impact: "Alto",
    },
    {
      id: "DEV-002",
      device: "Compresor C-103",
      component: "Válvula de presión",
      probability: 65,
      estimatedFailure: "22/06/2023",
      timeRemaining: "19 días",
      impact: "Medio",
    },
    {
      id: "DEV-003",
      device: "Sensor de Temperatura E5",
      component: "Calibración",
      probability: 42,
      estimatedFailure: "05/07/2023",
      timeRemaining: "32 días",
      impact: "Bajo",
    },
    {
      id: "DEV-004",
      device: "Cinta Transportadora 2",
      component: "Motor de tracción",
      probability: 78,
      estimatedFailure: "18/06/2023",
      timeRemaining: "15 días",
      impact: "Alto",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mantenimiento Predictivo</CardTitle>
        <CardDescription>Predicciones de fallos basadas en análisis de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead>Probabilidad</TableHead>
              <TableHead>Fecha Estimada</TableHead>
              <TableHead>Tiempo Restante</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenancePredictions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.device}</TableCell>
                <TableCell>{item.component}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          item.probability > 75
                            ? "bg-red-500"
                            : item.probability > 50
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${item.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{item.probability}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {item.estimatedFailure}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {item.timeRemaining}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.impact === "Alto"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : item.impact === "Medio"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-green-50 text-green-700 border-green-200"
                    }
                  >
                    {item.impact}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Tool className="h-3 w-3" />
                    Programar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
