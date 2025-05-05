import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get device counts by status
    const deviceStatusCounts = await prisma.device.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Get alert counts by severity
    const alertSeverityCounts = await prisma.alert.groupBy({
      by: ["severity"],
      _count: {
        id: true,
      },
      where: {
        status: "ACTIVE",
      },
    })

    // Get alert counts by status
    const alertStatusCounts = await prisma.alert.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Get upcoming maintenance
    const upcomingMaintenance = await prisma.maintenance.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
        completedAt: null,
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
    })

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
    })

    // Get total counts
    const totalDevices = await prisma.device.count()
    const totalAlerts = await prisma.alert.count({
      where: {
        status: "ACTIVE",
      },
    })
    const totalCategories = await prisma.category.count()
    const totalUsers = await prisma.user.count()

    // Get device readings for the last 24 hours
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const recentReadings = await prisma.deviceReading.findMany({
      where: {
        timestamp: {
          gte: oneDayAgo,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Group readings by device and type
    const readingsByDevice: any = {}
    recentReadings.forEach((reading) => {
      const deviceId = reading.deviceId
      const type = reading.type

      if (!readingsByDevice[deviceId]) {
        readingsByDevice[deviceId] = {
          deviceName: reading.device.name,
          readings: {},
        }
      }

      if (!readingsByDevice[deviceId].readings[type]) {
        readingsByDevice[deviceId].readings[type] = []
      }

      readingsByDevice[deviceId].readings[type].push({
        timestamp: reading.timestamp,
        value: reading.value,
        unit: reading.unit,
      })
    })

    return NextResponse.json({
      deviceStatusCounts,
      alertSeverityCounts,
      alertStatusCounts,
      upcomingMaintenance,
      recentActivities,
      totalDevices,
      totalAlerts,
      totalCategories,
      totalUsers,
      readingsByDevice,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
