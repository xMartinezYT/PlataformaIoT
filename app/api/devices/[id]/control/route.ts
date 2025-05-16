import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// Define allowed command types for type safety
type CommandType = "power" | "restart" | "update" | "configure" | "calibrate"

// Define the expected request body structure
interface CommandRequest {
  command: CommandType
  parameters?: Record<string, any>
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // Check if user has permission to control this device
    const supabase = createRouteHandlerClient({ cookies })
    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("user_id, status")
      .eq("id", params.id)
      .single()

    if (deviceError || !device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Check if the user owns the device or has admin role
    if (device.user_id !== payload.id && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse the command request
    const commandRequest: CommandRequest = await request.json()

    // Validate command type
    if (!["power", "restart", "update", "configure", "calibrate"].includes(commandRequest.command)) {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 })
    }

    // Process the command
    // In a real implementation, this would send the command to the actual device
    // For now, we'll just update the database to simulate the command execution

    let newStatus = device.status
    let commandResult = {}

    switch (commandRequest.command) {
      case "power":
        // Toggle power state
        newStatus = device.status === "ONLINE" ? "OFFLINE" : "ONLINE"
        commandResult = { newStatus }
        break
      case "restart":
        // Simulate restart sequence
        newStatus = "RESTARTING"
        commandResult = { restartInitiated: true }
        break
      case "update":
        // Simulate firmware update
        newStatus = "UPDATING"
        commandResult = {
          updateInitiated: true,
          version: commandRequest.parameters?.version || "latest",
        }
        break
      case "configure":
        // Apply configuration
        commandResult = {
          configurationApplied: true,
          settings: commandRequest.parameters || {},
        }
        break
      case "calibrate":
        // Perform calibration
        commandResult = {
          calibrationInitiated: true,
          sensor: commandRequest.parameters?.sensor || "all",
        }
        break
    }

    // Update device status in database
    const { error: updateError } = await supabase
      .from("devices")
      .update({
        status: newStatus,
        last_command: commandRequest.command,
        last_command_time: new Date().toISOString(),
        last_command_parameters: commandRequest.parameters || {},
      })
      .eq("id", params.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update device status" }, { status: 500 })
    }

    // Log the command in the activity table
    await supabase.from("activities").insert({
      user_id: payload.id,
      device_id: params.id,
      action: `device_command_${commandRequest.command}`,
      details: JSON.stringify({
        command: commandRequest.command,
        parameters: commandRequest.parameters || {},
        result: commandResult,
      }),
    })

    // Return success response
    return NextResponse.json({
      success: true,
      deviceId: params.id,
      command: commandRequest.command,
      result: commandResult,
    })
  } catch (error) {
    console.error("Error processing device command:", error)
    return NextResponse.json({ error: "Failed to process command" }, { status: 500 })
  }
}
