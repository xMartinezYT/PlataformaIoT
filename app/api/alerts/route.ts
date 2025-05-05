import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

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

    const alert = await prisma.alert.create({
      data: {
        ...data,
        userId: session.user.id,
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

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
