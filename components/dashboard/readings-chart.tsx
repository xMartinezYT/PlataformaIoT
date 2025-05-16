"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ReadingsChartProps {
  data: {
    deviceId: string
    deviceName: string
    readings: {
      [key: string]: {
        timestamp: string
        value: number
        unit: string
      }[]
    }
  }[]
}

export function ReadingsChart({ data }: ReadingsChartProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(data.length > 0 ? data[0].deviceId : null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Get the selected device
  const device = data.find((d) => d.deviceId === selectedDevice)

  // Get the reading types for the selected device
  const readingTypes = device ? Object.keys(device.readings) : []

  // If no type is selected and there are types available, select the first one
  if (!selectedType && readingTypes.length > 0 && !selectedType) {
    setSelectedType(readingTypes[0])
  }

  // Get the readings for the selected type
  const readings = device && selectedType ? device.readings[selectedType] : []

  // Format the data for the chart
  const chartData = readings.map((reading) => ({
    timestamp: new Date(reading.timestamp),
    value: reading.value,
    unit: reading.unit,
  }))

  // Colors for the lines
  const lineColors = ["#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#EC4899"]

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-muted-foreground">No hay datos de lecturas disponibles</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="device-select">Dispositivo</Label>
              <Select
                value={selectedDevice || ""}
                onValueChange={(value) => {
                  setSelectedDevice(value)
                  setSelectedType(null) // Reset the selected type when changing device
                }}
              >
                <SelectTrigger id="device-select" className="w-[200px]">
                  <SelectValue placeholder="Seleccionar dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {data.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.deviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {readingTypes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="reading-type-select">Tipo de lectura</Label>
                <Select value={selectedType || ""} onValueChange={setSelectedType}>
                  <SelectTrigger id="reading-type-select" className="w-[200px]">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {readingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(timestamp) => format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} ${props.payload.unit || ""}`,
                      selectedType || "Valor",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={selectedType || "Valor"}
                    stroke={lineColors[0]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No hay datos disponibles para mostrar</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
