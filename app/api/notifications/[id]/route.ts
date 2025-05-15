import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

// Actualizar el estado de una notificación
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Actualizar el estado de la notificación
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        status,
        readAt: status === "READ" ? new Date() : notification.readAt,
      },
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error("Error al actualizar notificación:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Eliminar una notificación
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Eliminar la notificación
    await prisma.notification.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar notificación:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
