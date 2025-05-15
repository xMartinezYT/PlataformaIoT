import { NextResponse } from "next/server"
import { notificationService } from "@/lib/services/notification-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get URL parameters
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : 20

    const notifications = await notificationService.getNotificationsByUserId(user.id, status || undefined, limit)
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can create notifications for other users
    const body = await request.json()
    if (body.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const notification = await notificationService.createNotification({
      ...body,
      user_id: body.user_id || user.id,
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
