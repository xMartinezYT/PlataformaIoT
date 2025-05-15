import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

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
            status: true,
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
          deviceId,
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

    // Convert to array
    const readingsData = Object.values(readingsByDevice)

    // Get devices with most alerts
    const devicesWithMostAlerts = await prisma.device.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        _count: {
          select: {
            alerts: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: {
        alerts: {
          _count: "desc",
        },
      },
      take: 5,
    })

    // Get most active users
    const mostActiveUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: {
        activities: {
          _count: "desc",
        },
      },
      take: 5,
    })

    // Get alert trends (compare with previous period)
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const alertsToday = await prisma.alert.count({
      where: {
        timestamp: {
          gte: oneDayAgo,
        },
      },
    })

    const alertsYesterday = await prisma.alert.count({
      where: {
        timestamp: {
          gte: twoDaysAgo,
          lt: oneDayAgo,
        },
      },
    })

    const alertTrend = alertsYesterday > 0 ? Math.round(((alertsToday - alertsYesterday) / alertsYesterday) * 100) : 0

    // Get device status trends
    const devicesOnlineToday = await prisma.device.count({
      where: {
        status: "ONLINE",
      },
    })

    const devicesOnlineYesterday = await prisma.device.count({
      where: {
        status: "ONLINE",
        updatedAt: {
          lt: oneDayAgo,
        },
      },
    })

    const deviceOnlineTrend =
      devicesOnlineYesterday > 0
        ? Math.round(((devicesOnlineToday - devicesOnlineYesterday) / devicesOnlineYesterday) * 100)
        : 0

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
      readingsData,
      devicesWithMostAlerts,
      mostActiveUsers,
      alertTrend,
      deviceOnlineTrend,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
