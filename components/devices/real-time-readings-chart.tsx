"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface RealTimeReadingsChartProps {
  readings: any[]
}

export function RealTimeReadingsChart({ readings }: RealTimeReadingsChartProps) {
  // Get unique reading types
  const readingTypes = useMemo(() => {
    const types = new Set<string>()
    readings.forEach((reading) => types.add(reading.type))
    return Array.from(types)
  }, [readings])

  const [selectedType, setSelectedType] = useState<string>(readingTypes[0] || "")

  // Filter readings by selected type
  const filteredReadings = useMemo(() => {
    if (!selectedType) return []
    return readings
      .filter((reading) => reading.type === selectedType)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-100) // Limit to last 100 readings for performance
  }, [readings, selectedType])

  // Get unit for selected type
  const unit = useMemo(() => {
    if (!selectedType || filteredReadings.length === 0) return ""
    return filteredReadings[0].unit || ""
  }, [selectedType, filteredReadings])

  // Format data for chart
  const chartData = useMemo(() => {
    return filteredReadings.map((reading) => ({
      timestamp: new Date(reading.timestamp),
      value: reading.value,
    }))
  }, [filteredReadings])

  if (readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md">
        <p className="text-muted-foreground">No readings available</p>
      </div>
    )
  }

  if (readingTypes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-md">
        <p className="text-muted-foreground">No reading types available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-48">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Select reading type" />
            </SelectTrigger>
            <SelectContent>
              {readingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {unit && <div className="text-sm text-muted-foreground">Unit: {unit}</div>}
      </div>

      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(timestamp) => format(timestamp, "HH:mm:ss")} minTickGap={30} />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => format(timestamp, "yyyy-MM-dd HH:mm:ss")}
                formatter={(value: number) => [`${value} ${unit}`, selectedType]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                stroke="#3b82f6"
                dot={false}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full border rounded-md">
            <p className="text-muted-foreground">No data available for {selectedType}</p>
          </div>
        )}
      </div>
    </div>
  )
}
