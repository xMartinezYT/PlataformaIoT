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
    const deviceId = searchParams.get("deviceId")
    const status = searchParams.get("status")

    const whereClause: any = {}

    if (deviceId) {
      whereClause.deviceId = deviceId
    }

    if (status) {
      whereClause.status = status
    }

    const rules = await prisma.automationRule.findMany({
      where: whereClause,
      include: {
        device: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error("Error fetching automation rules:", error)
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

    const rule = await prisma.automationRule.create({
      data,
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "rule_add",
        details: `Añadida regla de automatización: ${rule.name}`,
      },
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error("Error creating automation rule:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
