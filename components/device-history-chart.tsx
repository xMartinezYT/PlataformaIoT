"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Datos simulados para el historial
const generateHistoryData = (deviceId: string) => {
  const now = new Date()
  const data = []

  // Generar datos para las últimas 24 horas
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)

    if (deviceId.startsWith("SEN")) {
      // Datos para sensores de temperatura
      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperatura: 20 + Math.random() * 8,
        humedad: 40 + Math.random() * 15,
      })
    } else if (deviceId.startsWith("MOT")) {
      // Datos para motores
      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        rpm: 70 + Math.random() * 15,
        potencia: 80 + Math.random() * 20,
        temperatura: 35 + Math.random() * 10,
      })
    }
  }

  return data
}

export default function DeviceHistoryChart({ deviceId }: { deviceId: string }) {
  const [timeRange, setTimeRange] = useState("24h")
  const [historyData, setHistoryData] = useState<any[]>([])

  useEffect(() => {
    // Simular carga de datos históricos
    setHistoryData(generateHistoryData(deviceId))
  }, [deviceId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Historial de Datos</CardTitle>
          <CardDescription>Visualización de datos históricos del dispositivo</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {deviceId.startsWith("SEN") ? (
            <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperatura"
                name="Temperatura (°C)"
                stroke="#f97316"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="humedad" name="Humedad (%)" stroke="#0ea5e9" />
            </LineChart>
          ) : (
            <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="rpm" name="RPM" stroke="#f97316" activeDot={{ r: 8 }} />
              <Line yAxisId="left" type="monotone" dataKey="potencia" name="Potencia (%)" stroke="#22c55e" />
              <Line yAxisId="right" type="monotone" dataKey="temperatura" name="Temperatura (°C)" stroke="#ef4444" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
