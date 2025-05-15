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

    const rule = await prisma.automationRule.findUnique({
      where: { id: params.id },
      include: {
        device: true,
      },
    })

    if (!rule) {
      return NextResponse.json({ error: "Automation rule not found" }, { status: 404 })
    }

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Error fetching automation rule:", error)
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

    const rule = await prisma.automationRule.update({
      where: { id: params.id },
      data,
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "rule_update",
        details: `Actualizada regla de automatización: ${rule.name}`,
      },
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error("Error updating automation rule:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin, manager or technician role
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER" && session.user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get rule before deletion for activity log
    const rule = await prisma.automationRule.findUnique({
      where: { id: params.id },
      select: { name: true },
    })

    if (!rule) {
      return NextResponse.json({ error: "Automation rule not found" }, { status: 404 })
    }

    await prisma.automationRule.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "rule_delete",
        details: `Eliminada regla de automatización: ${rule.name}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting automation rule:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
