import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const whereClause: any = {
      deviceId: params.id,
    }

    if (type) {
      whereClause.type = type
    }

    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const readings = await prisma.deviceReading.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
      take: limit,
    })

    return NextResponse.json(readings)
  } catch (error) {
    console.error("Error fetching readings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Check if device exists
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    })

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    const reading = await prisma.deviceReading.create({
      data: {
        ...data,
        deviceId: params.id,
      },
    })

    // Update device status to ONLINE
    await prisma.device.update({
      where: { id: params.id },
      data: { status: "ONLINE", updatedAt: new Date() },
    })

    // Check automation rules
    const rules = await prisma.automationRule.findMany({
      where: {
        deviceId: params.id,
        status: "ACTIVE",
      },
    })

    // Simple rule processing (in a real system, this would be more sophisticated)
    for (const rule of rules) {
      if (
        rule.condition.includes(`${data.type} >`) &&
        data.value > Number.parseFloat(rule.condition.split(">")[1].trim())
      ) {
        // Create an alert based on the rule
        if (rule.action.includes("createAlert")) {
          await prisma.alert.create({
            data: {
              deviceId: params.id,
              userId: session.user.id,
              title: `Alerta automática: ${data.type}`,
              message: `El valor de ${data.type} (${data.value} ${data.unit || ""}) ha superado el umbral establecido`,
              severity: "MEDIUM",
              status: "ACTIVE",
            },
          })
        }
      }
    }

    return NextResponse.json(reading, { status: 201 })
  } catch (error) {
    console.error("Error creating reading:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
