"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"

interface AlertSeverityChartProps {
  data: {
    severity: string
    count: number
  }[]
}

export function AlertSeverityChart({ data }: AlertSeverityChartProps) {
  // Mapeo de severidades a colores
  const severityColors: Record<string, string> = {
    CRITICAL: "#EF4444", // rojo
    HIGH: "#F97316", // naranja
    MEDIUM: "#F59E0B", // amarillo
    LOW: "#10B981", // verde
    INFO: "#3B82F6", // azul
  }

  // Mapeo de severidades a etiquetas en español
  const severityLabels: Record<string, string> = {
    CRITICAL: "Crítica",
    HIGH: "Alta",
    MEDIUM: "Media",
    LOW: "Baja",
    INFO: "Informativa",
  }

  // Formatear los datos para el gráfico
  const chartData = data.map((item) => ({
    name: severityLabels[item.severity] || item.severity,
    value: item.count,
    severity: item.severity,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value: number) => [`${value} alertas`, "Cantidad"]}
            labelFormatter={(name) => `Severidad: ${name}`}
          />
          <Legend />
          <Bar dataKey="value" name="Alertas" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={severityColors[entry.severity] || "#8884d8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
