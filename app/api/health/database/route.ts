import { NextResponse } from "next/server"
import { checkDatabaseHealth, getDbClient } from "@/lib/enhanced-db"

export async function GET() {
  try {
    const isHealthy = await checkDatabaseHealth()
    const status = getDbClient().getStatus()

    if (isHealthy) {
      return NextResponse.json({
        status: "healthy",
        message: "Database connection is healthy",
        details: status,
      })
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Database connection is not healthy",
          details: status,
        },
        { status: 503 },
      ) // Service Unavailable
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check database health",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
