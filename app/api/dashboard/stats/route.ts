import { NextResponse } from "next/server"
import { deviceService } from "@/lib/services/device-service"
import { alertService } from "@/lib/services/alert-service"
import { getUserFromRequest } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get device statistics
    const deviceStats = await deviceService.getDeviceStats(user.id)

    // Get alert statistics
    const alertStats = await alertService.getAlertStats(user.id)

    // Combine all stats
    const dashboardStats = {
      ...deviceStats,
      ...alertStats,
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
