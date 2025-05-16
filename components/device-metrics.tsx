"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const temperatureData = [
  { time: "00:00", temp: 22.5, humidity: 45 },
  { time: "03:00", temp: 21.8, humidity: 44 },
  { time: "06:00", temp: 22.2, humidity: 48 },
  { time: "09:00", temp: 23.5, humidity: 50 },
  { time: "12:00", temp: 25.1, humidity: 52 },
  { time: "15:00", temp: 24.8, humidity: 49 },
  { time: "18:00", temp: 24.0, humidity: 47 },
  { time: "21:00", temp: 23.2, humidity: 46 },
]

const energyData = [
  { hour: "00", consumption: 18 },
  { hour: "02", consumption: 16 },
  { hour: "04", consumption: 17 },
  { hour: "06", consumption: 19 },
  { hour: "08", consumption: 25 },
  { hour: "10", consumption: 32 },
  { hour: "12", consumption: 35 },
  { hour: "14", consumption: 38 },
  { hour: "16", consumption: 34 },
  { hour: "18", consumption: 30 },
  { hour: "20", consumption: 25 },
  { hour: "22", consumption: 20 },
]

const productionData = [
  { day: "Lun", lineA: 120, lineB: 110, lineC: 90 },
  { day: "Mar", lineA: 132, lineB: 123, lineC: 93 },
  { day: "Mié", lineA: 125, lineB: 125, lineC: 85 },
  { day: "Jue", lineA: 130, lineB: 128, lineC: 88 },
  { day: "Vie", lineA: 128, lineB: 129, lineC: 90 },
  { day: "Sáb", lineA: 90, lineB: 85, lineC: 65 },
  { day: "Dom", lineA: 85, lineB: 80, lineC: 60 },
]

export default function DeviceMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Temperatura y Humedad</CardTitle>
          <CardDescription>Últimas 24 horas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="Temperatura (°C)"
                stroke="#f97316"
                activeDot={{ r: 8 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humedad (%)" stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Consumo Energético</CardTitle>
          <CardDescription>Hoy (kWh)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consumption" name="Consumo (kWh)" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Producción</CardTitle>
          <CardDescription>Unidades por línea</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="lineA" name="Línea A" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="lineB" name="Línea B" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="lineC" name="Línea C" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
