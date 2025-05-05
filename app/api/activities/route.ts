import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const action = searchParams.get("action")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const whereClause: any = {}

    if (userId) {
      whereClause.userId = userId
    }

    if (action) {
      whereClause.action = action
    }

    // Regular users can only see their own activities
    if (session.user.role === "USER") {
      whereClause.userId = session.user.id
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const activity = await prisma.activity.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
