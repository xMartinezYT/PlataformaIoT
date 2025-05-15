import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface ActivityItemProps {
  user: {
    name?: string | null
    email?: string | null
  }
  action: string
  details?: string | null
  timestamp: Date
}

export function ActivityItem({ user, action, details, timestamp }: ActivityItemProps) {
  // Mapeo de acciones a emojis y clases de color
  const actionConfig: Record<string, { emoji: string; colorClass: string }> = {
    login: { emoji: "🔑", colorClass: "bg-blue-100 text-blue-800" },
    register: { emoji: "👤", colorClass: "bg-green-100 text-green-800" },
    device_add: { emoji: "📱", colorClass: "bg-purple-100 text-purple-800" },
    device_update: { emoji: "🔄", colorClass: "bg-yellow-100 text-yellow-800" },
    device_delete: { emoji: "🗑️", colorClass: "bg-red-100 text-red-800" },
    alert_create: { emoji: "🚨", colorClass: "bg-red-100 text-red-800" },
    alert_ack: { emoji: "👁️", colorClass: "bg-blue-100 text-blue-800" },
    alert_resolve: { emoji: "✅", colorClass: "bg-green-100 text-green-800" },
    password_reset_request: { emoji: "🔒", colorClass: "bg-yellow-100 text-yellow-800" },
    password_reset_complete: { emoji: "🔓", colorClass: "bg-green-100 text-green-800" },
    ai_chat: { emoji: "🤖", colorClass: "bg-purple-100 text-purple-800" },
  }

  // Usar configuración predeterminada si la acción no está mapeada
  const { emoji, colorClass } = actionConfig[action] || { emoji: "📋", colorClass: "bg-gray-100 text-gray-800" }

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
        <span role="img" aria-label={action}>
          {emoji}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">{user.name || user.email || "Usuario"}</div>
        <div className="mt-0.5 text-sm text-gray-500">{details || getActionDescription(action)}</div>
        <div className="mt-1 text-xs text-gray-400">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es })}
        </div>
      </div>
    </div>
  )
}

// Función para obtener una descripción legible de la acción
function getActionDescription(action: string): string {
  const descriptions: Record<string, string> = {
    login: "Inició sesión en la plataforma",
    register: "Se registró en la plataforma",
    device_add: "Añadió un nuevo dispositivo",
    device_update: "Actualizó un dispositivo",
    device_delete: "Eliminó un dispositivo",
    alert_create: "Creó una nueva alerta",
    alert_ack: "Reconoció una alerta",
    alert_resolve: "Resolvió una alerta",
    password_reset_request: "Solicitó restablecer su contraseña",
    password_reset_complete: "Restableció su contraseña",
    ai_chat: "Consultó al asistente IA",
  }

  return descriptions[action] || "Realizó una acción en la plataforma"
}
