import type React from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray"
}

export function StatCard({ title, value, description, icon, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  }

  const trendColorClasses = trend?.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon && <div className="text-lg">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && (
          <span className={`ml-2 text-xs font-medium ${trendColorClasses} px-2 py-0.5 rounded-full`}>
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {description && <p className="mt-1 text-xs opacity-80">{description}</p>}
    </div>
  )
}
