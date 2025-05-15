import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

// Obtener notificaciones del usuario actual
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number(searchParams.get("limit") || "20")
    const offset = Number(searchParams.get("offset") || "0")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (status) {
      whereClause.status = status
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.notification.count({
      where: whereClause,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        status: "UNREAD",
      },
    })

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
    })
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Crear una nueva notificación
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Solo administradores y managers pueden crear notificaciones para otros usuarios
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { userId, title, message, type, link } = data

    if (!userId || !title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Crear la notificación
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

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
