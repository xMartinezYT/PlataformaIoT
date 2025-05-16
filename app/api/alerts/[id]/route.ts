import { NextResponse } from "next/server"
import { alertService } from "@/lib/services/alert-service"
import { deviceService } from "@/lib/services/device-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const alert = await alertService.getAlertById(params.id)
    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    // Check if user owns the device associated with the alert
    const device = await deviceService.getDeviceById(alert.device_id)
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (device.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("Error fetching alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if alert exists
    const existingAlert = await alertService.getAlertById(params.id)
    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    // Check if user owns the device associated with the alert
    const device = await deviceService.getDeviceById(existingAlert.device_id)
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (device.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const alert = await alertService.updateAlert(params.id, body)

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
