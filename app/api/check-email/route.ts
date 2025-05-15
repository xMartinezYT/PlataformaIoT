import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    return NextResponse.json({
      exists: !!user,
    })
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()

    // Validate input
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    return NextResponse.json({
      exists: !!user,
    })
  } catch (error) {
    console.error("Check email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
