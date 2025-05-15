import { NextResponse } from "next/server"
import { alertService } from "@/lib/services/alert-service"
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
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : 100

    const alerts = await alertService.getAlertsByUserId(user.id, status || undefined, limit)
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const alert = await alertService.createAlert({
      ...body,
      user_id: user.id,
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
