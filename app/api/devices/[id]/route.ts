import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("devices")
      .select("*, categories(*)")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("Error fetching device:", error)
      return NextResponse.json({ error: "Failed to fetch device" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/devices/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // First check if the device belongs to the user
    const { data: existingDevice } = await supabase
      .from("devices")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not found or you do not have permission to update it" },
        { status: 404 },
      )
    }

    const { data, error } = await supabase.from("devices").update(body).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating device:", error)
      return NextResponse.json({ error: "Failed to update device" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PUT /api/devices/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First check if the device belongs to the user
    const { data: existingDevice } = await supabase
      .from("devices")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not found or you do not have permission to delete it" },
        { status: 404 },
      )
    }

    const { error } = await supabase.from("devices").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting device:", error)
      return NextResponse.json({ error: "Failed to delete device" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/devices/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
