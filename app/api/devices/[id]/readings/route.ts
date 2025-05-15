import { NextResponse } from "next/server"
import { deviceService } from "@/lib/services/device-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if device exists and user owns it
    const device = await deviceService.getDeviceById(params.id)
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (device.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get URL parameters
    const url = new URL(request.url)
    const limit = url.searchParams.get("limit") ? Number.parseInt(url.searchParams.get("limit")!) : 100

    const readings = await deviceService.getDeviceReadings(params.id, limit)
    return NextResponse.json({ readings })
  } catch (error) {
    console.error("Error fetching device readings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if device exists and user owns it
    const device = await deviceService.getDeviceById(params.id)
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (device.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const reading = await deviceService.addDeviceReading({
      device_id: params.id,
      type: body.type,
      value: body.value,
      unit: body.unit,
      timestamp: body.timestamp,
    })

    return NextResponse.json({ reading }, { status: 201 })
  } catch (error) {
    console.error("Error creating device reading:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
