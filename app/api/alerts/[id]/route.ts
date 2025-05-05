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

    const alert = await prisma.alert.findUnique({
      where: { id: params.id },
      include: {
        device: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Error fetching alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Get alert before update for activity log
    const previousAlert = await prisma.alert.findUnique({
      where: { id: params.id },
      select: { title: true, status: true },
    })

    if (!previousAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    const alert = await prisma.alert.update({
      where: { id: params.id },
      data,
    })

    // Log activity for status changes
    if (data.status && data.status !== previousAlert.status) {
      let action = "alert_update"
      if (data.status === "ACKNOWLEDGED") action = "alert_ack"
      if (data.status === "RESOLVED") action = "alert_resolve"
      if (data.status === "IGNORED") action = "alert_ignore"

      await prisma.activity.create({
        data: {
          userId: session.user.id,
          action,
          details: `Alerta "${previousAlert.title}" cambió a estado: ${data.status}`,
        },
      })
    }

    return NextResponse.json(alert)
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get alert before deletion for activity log
    const alert = await prisma.alert.findUnique({
      where: { id: params.id },
      select: { title: true },
    })

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    await prisma.alert.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "alert_delete",
        details: `Eliminada alerta: ${alert.title}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting alert:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
