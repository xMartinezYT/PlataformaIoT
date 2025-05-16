import { NextResponse } from "next/server"
import { notificationService } from "@/lib/services/notification-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notification = await notificationService.getNotificationById(params.id)
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Check if notification belongs to user
    if (notification.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Error fetching notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if notification exists and belongs to user
    const existingNotification = await notificationService.getNotificationById(params.id)
    if (!existingNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (existingNotification.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Only allow marking as read
    if (body.status === "READ") {
      const notification = await notificationService.markAsRead(params.id)
      return NextResponse.json({ notification })
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if notification exists and belongs to user
    const existingNotification = await notificationService.getNotificationById(params.id)
    if (!existingNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    if (existingNotification.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await notificationService.deleteNotification(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
