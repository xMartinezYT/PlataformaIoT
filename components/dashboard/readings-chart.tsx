"use client"

import React, { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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

  // Obtener el dispositivo seleccionado
  const device = data.find((d) => d.deviceId === selectedDevice)

  // Obtener los tipos de lecturas disponibles para el dispositivo seleccionado
  const readingTypes = device ? Object.keys(device.readings) : []

  // Si no hay un tipo seleccionado y hay tipos disponibles, seleccionar el primero
  React.useEffect(() => {
    if (!selectedType && readingTypes.length > 0) {
      setSelectedType(readingTypes[0])
    }
  }, [selectedDevice, selectedType, readingTypes])

  // Obtener las lecturas para el tipo seleccionado
  const readings = device && selectedType ? device.readings[selectedType] : []

  // Formatear los datos para el gráfico
  const chartData = readings.map((reading) => ({
    timestamp: new Date(reading.timestamp),
    value: reading.value,
    unit: reading.unit,
  }))

  // Colores para las líneas
  const lineColors = ["#3B82F6", "#10B981", "#F97316", "#8B5CF6", "#EC4899"]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          value={selectedDevice || ""}
          onChange={(e) => {
            setSelectedDevice(e.target.value)
            setSelectedType(null) // Resetear el tipo seleccionado al cambiar de dispositivo
          }}
        >
          {data.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.deviceName}
            </option>
          ))}
        </select>

        {readingTypes.length > 0 && (
          <select
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
            value={selectedType || ""}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {readingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm", { locale: es })}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es })}
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
            <p className="text-gray-500">No hay datos disponibles para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
