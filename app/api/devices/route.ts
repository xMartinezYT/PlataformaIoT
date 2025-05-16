import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching devices:", error)
      return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/devices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Ensure the user_id matches the current user
    if (body.user_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("devices").insert(body).select().single()

    if (error) {
      console.error("Error creating device:", error)
      return NextResponse.json({ error: "Failed to create device" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/devices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
