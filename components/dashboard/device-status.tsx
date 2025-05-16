interface DeviceStatusProps {
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR" | "INACTIVE"
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function DeviceStatus({ status, showLabel = true, size = "md" }: DeviceStatusProps) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    ONLINE: { color: "bg-green-500", label: "En línea" },
    OFFLINE: { color: "bg-gray-500", label: "Desconectado" },
    MAINTENANCE: { color: "bg-yellow-500", label: "En mantenimiento" },
    ERROR: { color: "bg-red-500", label: "Error" },
    INACTIVE: { color: "bg-gray-300", label: "Inactivo" },
  }

  const { color, label } = statusConfig[status] || statusConfig.OFFLINE

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }

  return (
    <div className="flex items-center">
      <div className={`${sizeClasses[size]} rounded-full ${color} animate-pulse`} />
      {showLabel && <span className="ml-2 text-sm text-gray-700">{label}</span>}
    </div>
  )
}
