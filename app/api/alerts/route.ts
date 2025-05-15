import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { notifyUserAboutAlert } from "@/lib/notification-service"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const deviceId = searchParams.get("deviceId")

    const whereClause: any = {}

    if (status) {
      whereClause.status = status
    }

    if (severity) {
      whereClause.severity = severity
    }

    if (deviceId) {
      whereClause.deviceId = deviceId
    }

    const alerts = await prisma.alert.findMany({
      where: whereClause,
      include: {
        device: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Crear la alerta
    const alert = await prisma.alert.create({
      data: {
        ...data,
        userId: session.user.id,
      },
      include: {
        device: true,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "alert_create",
        details: `Creada alerta: ${alert.title}`,
      },
    })

    // Enviar notificación para alertas críticas y altas
    if (alert.severity === "CRITICAL" || alert.severity === "HIGH") {
      try {
        // Notificar al propietario del dispositivo
        if (alert.device.userId) {
          await notifyUserAboutAlert(alert.device.userId, alert.id, alert.device.name, alert.title, alert.severity)
        }

        // Notificar a administradores y managers
        const admins = await prisma.user.findMany({
          where: {
            role: {
              in: ["ADMIN", "MANAGER"],
            },
          },
          select: {
            id: true,
          },
        })

        for (const admin of admins) {
          // Evitar duplicados si el propietario es admin/manager
          if (admin.id !== alert.device.userId) {
            await notifyUserAboutAlert(admin.id, alert.id, alert.device.name, alert.title, alert.severity)
          }
        }
      } catch (notificationError) {
        console.error("Error al enviar notificaciones de alerta:", notificationError)
        // No fallamos la creación de la alerta si falla la notificación
      }
    }

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
