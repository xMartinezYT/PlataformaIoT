import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { notifyUserAboutDeviceStatus } from "@/lib/notification-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        readings: {
          orderBy: { timestamp: "desc" },
          take: 100,
        },
        alerts: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        maintenances: {
          orderBy: { scheduledAt: "desc" },
          take: 10,
        },
        automationRules: true,
      },
    })

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error fetching device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Obtener el dispositivo actual para comparar el estado
    const currentDevice = await prisma.device.findUnique({
      where: { id: params.id },
      select: { status: true, userId: true, name: true },
    })

    if (!currentDevice) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Actualizar el dispositivo
    const device = await prisma.device.update({
      where: { id: params.id },
      data,
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "device_update",
        details: `Actualizado dispositivo: ${device.name}`,
      },
    })

    // Enviar notificación si el estado cambió a ERROR u OFFLINE
    if (data.status && data.status !== currentDevice.status && (data.status === "ERROR" || data.status === "OFFLINE")) {
      try {
        // Notificar al propietario del dispositivo
        if (currentDevice.userId) {
          await notifyUserAboutDeviceStatus(currentDevice.userId, params.id, device.name, data.status)
        }

        // Notificar a administradores y managers para estados críticos
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
          if (admin.id !== currentDevice.userId) {
            await notifyUserAboutDeviceStatus(admin.id, params.id, device.name, data.status)
          }
        }
      } catch (notificationError) {
        console.error("Error al enviar notificaciones de estado de dispositivo:", notificationError)
        // No fallamos la actualización del dispositivo si falla la notificación
      }
    }

    return NextResponse.json(device)
  } catch (error) {
    console.error("Error updating device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get device name before deletion for activity log
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      select: { name: true },
    })

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    await prisma.device.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "device_delete",
        details: `Eliminado dispositivo: ${device.name}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
