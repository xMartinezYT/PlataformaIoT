import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DeviceStatus } from "./device-status"

interface MaintenanceItem {
  id: string
  title: string
  scheduledAt: string
  completedAt: string | null
  device: {
    id: string
    name: string
    serialNumber: string
    status: "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR" | "INACTIVE"
  }
}

interface MaintenanceListProps {
  maintenances: MaintenanceItem[]
}

export function MaintenanceList({ maintenances }: MaintenanceListProps) {
  if (maintenances.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-8">
        <p className="text-gray-500">No hay mantenimientos programados</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {maintenances.map((maintenance) => (
          <li key={maintenance.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{maintenance.title}</p>
                <div className="mt-1 flex items-center">
                  <span className="truncate text-sm text-gray-500">{maintenance.device.name}</span>
                  <span className="mx-1 text-gray-500">•</span>
                  <DeviceStatus status={maintenance.device.status} size="sm" />
                </div>
              </div>
              <div className="ml-4 flex flex-shrink-0 flex-col items-end">
                <p className="text-sm text-gray-500">
                  {format(new Date(maintenance.scheduledAt), "dd MMM yyyy", { locale: es })}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {format(new Date(maintenance.scheduledAt), "HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
