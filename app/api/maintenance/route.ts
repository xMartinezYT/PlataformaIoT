import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")
    const completed = searchParams.get("completed")
    const upcoming = searchParams.get("upcoming")

    const whereClause: any = {}

    if (deviceId) {
      whereClause.deviceId = deviceId
    }

    if (completed === "true") {
      whereClause.completedAt = { not: null }
    } else if (completed === "false") {
      whereClause.completedAt = null
    }

    if (upcoming === "true") {
      whereClause.scheduledAt = { gte: new Date() }
    }

    const maintenances = await prisma.maintenance.findMany({
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
      },
      orderBy: { scheduledAt: "asc" },
    })

    return NextResponse.json(maintenances)
  } catch (error) {
    console.error("Error fetching maintenances:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin, manager or technician role
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER" && session.user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()

    const maintenance = await prisma.maintenance.create({
      data,
    })

    // If maintenance is scheduled for now, update device status
    if (new Date(data.scheduledAt) <= new Date() && !data.completedAt) {
      await prisma.device.update({
        where: { id: data.deviceId },
        data: { status: "MAINTENANCE" },
      })
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "maintenance_schedule",
        details: `Programado mantenimiento: ${maintenance.title}`,
      },
    })

    return NextResponse.json(maintenance, { status: 201 })
  } catch (error) {
    console.error("Error creating maintenance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
