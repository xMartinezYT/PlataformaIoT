import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all devices with their latest readings
    const devices = await prisma.device.findMany({
      include: {
        category: true,
        readings: {
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
    })

    // Format data for SCADA visualization
    const scadaData = devices.map((device) => {
      const latestReading = device.readings[0]

      return {
        id: device.id,
        name: device.name,
        serialNumber: device.serialNumber,
        status: device.status,
        location: device.location,
        category: device.category?.name || "Uncategorized",
        latitude: device.latitude,
        longitude: device.longitude,
        lastReading: latestReading
          ? {
              type: latestReading.type,
              value: latestReading.value,
              unit: latestReading.unit,
              timestamp: latestReading.timestamp,
            }
          : null,
      }
    })

    return NextResponse.json(scadaData)
  } catch (error) {
    console.error("Error fetching SCADA data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
