"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface DeviceStatusChartProps {
  data: {
    status: string
    count: number
  }[]
}

export function DeviceStatusChart({ data }: DeviceStatusChartProps) {
  // Mapeo de estados a colores
  const statusColors: Record<string, string> = {
    ONLINE: "#10B981", // verde
    OFFLINE: "#6B7280", // gris
    MAINTENANCE: "#F59E0B", // amarillo
    ERROR: "#EF4444", // rojo
    INACTIVE: "#D1D5DB", // gris claro
  }

  // Mapeo de estados a etiquetas en español
  const statusLabels: Record<string, string> = {
    ONLINE: "En línea",
    OFFLINE: "Desconectado",
    MAINTENANCE: "En mantenimiento",
    ERROR: "Error",
    INACTIVE: "Inactivo",
  }

  // Formatear los datos para el gráfico
  const chartData = data.map((item) => ({
    name: statusLabels[item.status] || item.status,
    value: item.count,
    status: item.status,
  }))

  // Renderizador personalizado para las etiquetas
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  return (
    <div className="h-64 w-full">
      {chartData.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} dispositivos`, "Cantidad"]}
              labelFormatter={(name) => `Estado: ${name}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
