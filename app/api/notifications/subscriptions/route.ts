import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

// Guardar una nueva suscripción
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subscription } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 })
    }

    // Verificar si ya existe una suscripción con este endpoint
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    })

    if (existingSubscription) {
      // Actualizar la suscripción existente
      await prisma.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updatedAt: new Date(),
        },
      })
    } else {
      // Crear una nueva suscripción
      await prisma.pushSubscription.create({
        data: {
          userId: session.user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      })
    }

    // Registrar actividad
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "notification_subscribe",
        details: "Suscripción a notificaciones push",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al guardar suscripción:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Eliminar una suscripción
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required" }, { status: 400 })
    }

    // Eliminar la suscripción
    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId: session.user.id,
      },
    })

    // Registrar actividad
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "notification_unsubscribe",
        details: "Cancelación de suscripción a notificaciones push",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar suscripción:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
