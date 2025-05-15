import { NextResponse } from "next/server"
import { deviceService } from "@/lib/services/device-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const device = await deviceService.getDeviceById(params.id)
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Check if user owns the device
    if (device.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ device })
  } catch (error) {
    console.error("Error fetching device:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if device exists and user owns it
    const existingDevice = await deviceService.getDeviceById(params.id)
    if (!existingDevice) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (existingDevice.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const device = await deviceService.updateDevice(params.id, body)

    return NextResponse.json({ device })
  } catch (error) {
    console.error("Error updating device:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if device exists and user owns it
    const existingDevice = await deviceService.getDeviceById(params.id)
    if (!existingDevice) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    if (existingDevice.user_id !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await deviceService.deleteDevice(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting device:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
