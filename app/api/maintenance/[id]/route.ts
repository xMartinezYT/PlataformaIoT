import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const maintenance = await prisma.maintenance.findUnique({
      where: { id: params.id },
      include: {
        device: true,
      },
    })

    if (!maintenance) {
      return NextResponse.json({ error: "Maintenance not found" }, { status: 404 })
    }

    return NextResponse.json(maintenance)
  } catch (error) {
    console.error("Error fetching maintenance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const maintenance = await prisma.maintenance.update({
      where: { id: params.id },
      data,
      include: {
        device: true,
      },
    })

    // If maintenance is completed, update device status back to ONLINE
    if (data.completedAt && maintenance.device.status === "MAINTENANCE") {
      await prisma.device.update({
        where: { id: maintenance.deviceId },
        data: { status: "ONLINE", lastMaintenance: new Date(data.completedAt) },
      })
    }

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: data.completedAt ? "maintenance_complete" : "maintenance_update",
        details: `${data.completedAt ? "Completado" : "Actualizado"} mantenimiento: ${maintenance.title}`,
      },
    })

    return NextResponse.json(maintenance)
  } catch (error) {
    console.error("Error updating maintenance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin or manager role
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get maintenance before deletion for activity log
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: params.id },
      select: { title: true },
    })

    if (!maintenance) {
      return NextResponse.json({ error: "Maintenance not found" }, { status: 404 })
    }

    await prisma.maintenance.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "maintenance_delete",
        details: `Eliminado mantenimiento: ${maintenance.title}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting maintenance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
