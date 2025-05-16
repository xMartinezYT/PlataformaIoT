import prisma from "@/lib/prisma"
import { webPush } from "@/lib/web-push"
import { v4 as uuidv4 } from "uuid"

interface NotificationPayload {
  title: string
  message: string
  url?: string
  tag?: string
  renotify?: boolean
  requireInteraction?: boolean
  actions?: Array<{
    action: string
    title: string
  }>
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "ALERT" | "MAINTENANCE" | "SYSTEM" | "DEVICE_STATUS" | "SECURITY",
  link?: string,
) {
  try {
    // Crear la notificación en la base de datos
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
        status: "UNREAD",
      },
    })

    return notification
  } catch (error) {
    console.error("Error al crear notificación:", error)
    throw error
  }
}

export async function sendPushNotification(userId: string, payload: NotificationPayload) {
  try {
    // Obtener las suscripciones del usuario
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) {
      console.log(`No hay suscripciones para el usuario ${userId}`)
      return
    }

    // Preparar el payload de la notificación
    const notificationPayload = JSON.stringify({
      title: payload.title,
      message: payload.message,
      url: payload.url,
      tag: payload.tag || uuidv4(),
      renotify: payload.renotify || false,
      requireInteraction: payload.requireInteraction || false,
      actions: payload.actions || [],
    })

    // Enviar la notificación a todas las suscripciones del usuario
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          notificationPayload,
        )
      } catch (error) {
        console.error(`Error al enviar notificación push a ${subscription.endpoint}:`, error)

        // Si la suscripción ya no es válida, eliminarla
        if ((error as any).statusCode === 410) {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    })

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error al enviar notificación push:", error)
    throw error
  }
}

export async function shouldNotifyUser(userId: string, notificationType: string): Promise<boolean> {
  try {
    // Obtener las preferencias del usuario
    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId },
    })

    // Si no hay preferencias, usar valores predeterminados
    if (!preferences) {
      return true
    }

    // Verificar si el tipo de notificación está habilitado
    switch (notificationType) {
      case "ALERT_CRITICAL":
        return preferences.alertCritical
      case "ALERT_HIGH":
        return preferences.alertHigh
      case "DEVICE_STATUS":
        return preferences.deviceStatus
      case "MAINTENANCE":
        return preferences.maintenance
      case "SECURITY":
        return preferences.security
      default:
        return true
    }
  } catch (error) {
    console.error("Error al verificar preferencias de notificación:", error)
    // En caso de error, permitir la notificación por defecto
    return true
  }
}

export async function notifyUserAboutAlert(
  userId: string,
  alertId: string,
  deviceName: string,
  alertTitle: string,
  severity: string,
) {
  // Determinar el tipo de notificación basado en la severidad
  const notificationType = severity === "CRITICAL" ? "ALERT_CRITICAL" : severity === "HIGH" ? "ALERT_HIGH" : null

  // Si no es una alerta crítica o alta, o si el usuario ha desactivado este tipo de notificaciones, no notificar
  if (!notificationType || !(await shouldNotifyUser(userId, notificationType))) {
    return null
  }

  const title = `Alerta ${getSeverityText(severity)}: ${deviceName}`
  const message = alertTitle
  const link = `/alerts/${alertId}`

  // Crear notificación en la base de datos
  const notification = await createNotification(userId, title, message, "ALERT", link)

  // Enviar notificación push
  await sendPushNotification(userId, {
    title,
    message,
    url: link,
    tag: `alert-${alertId}`,
    renotify: true,
    requireInteraction: severity === "CRITICAL" || severity === "HIGH",
  })

  return notification
}

export async function notifyUserAboutDeviceStatus(
  userId: string,
  deviceId: string,
  deviceName: string,
  status: string,
) {
  const title = `Estado de dispositivo: ${deviceName}`
  const message = `El dispositivo está ahora ${getStatusText(status)}`
  const link = `/devices/${deviceId}`

  // Crear notificación en la base de datos
  const notification = await createNotification(userId, title, message, "DEVICE_STATUS", link)

  // Enviar notificación push solo para estados críticos
  if (status === "ERROR" || status === "OFFLINE") {
    await sendPushNotification(userId, {
      title,
      message,
      url: link,
      tag: `device-status-${deviceId}`,
    })
  }

  return notification
}

export async function notifyUserAboutMaintenance(
  userId: string,
  maintenanceId: string,
  deviceName: string,
  maintenanceTitle: string,
  isUrgent = false,
) {
  const title = isUrgent ? `Mantenimiento urgente: ${deviceName}` : `Mantenimiento programado: ${deviceName}`
  const message = maintenanceTitle
  const link = `/maintenance/${maintenanceId}`

  // Crear notificación en la base de datos
  const notification = await createNotification(userId, title, message, "MAINTENANCE", link)

  // Enviar notificación push solo si es urgente
  if (isUrgent) {
    await sendPushNotification(userId, {
      title,
      message,
      url: link,
      tag: `maintenance-${maintenanceId}`,
      requireInteraction: true,
    })
  }

  return notification
}

export async function notifyUserAboutSecurity(userId: string, title: string, message: string, link?: string) {
  // Crear notificación en la base de datos
  const notification = await createNotification(userId, title, message, "SECURITY", link)

  // Enviar notificación push
  await sendPushNotification(userId, {
    title,
    message,
    url: link,
    tag: "security",
    requireInteraction: true,
  })

  return notification
}

// Funciones auxiliares
function getSeverityText(severity: string): string {
  switch (severity) {
    case "CRITICAL":
      return "Crítica"
    case "HIGH":
      return "Alta"
    case "MEDIUM":
      return "Media"
    case "LOW":
      return "Baja"
    case "INFO":
      return "Informativa"
    default:
      return severity
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "ONLINE":
      return "en línea"
    case "OFFLINE":
      return "desconectado"
    case "MAINTENANCE":
      return "en mantenimiento"
    case "ERROR":
      return "con errores"
    case "INACTIVE":
      return "inactivo"
    default:
      return status
  }
}
