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

    const devices = await prisma.device.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(devices)
  } catch (error) {
    console.error("Error fetching devices:", error)
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

    const device = await prisma.device.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "device_add",
        details: `Añadido nuevo dispositivo: ${device.name}`,
      },
    })

    return NextResponse.json(device, { status: 201 })
  } catch (error) {
    console.error("Error creating device:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
