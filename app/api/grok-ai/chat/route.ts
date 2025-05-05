import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get context data for the AI
    const devices = await prisma.device.findMany({
      select: {
        id: true,
        name: true,
        serialNumber: true,
        status: true,
        location: true,
      },
      take: 10,
    })

    const alerts = await prisma.alert.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        title: true,
        severity: true,
        device: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    })

    // Create a system prompt with context
    const systemPrompt = `
    You are an AI assistant for an IoT platform. You have access to the following information:
    
    Devices: ${JSON.stringify(devices)}
    Active Alerts: ${JSON.stringify(alerts)}
    
    Help the user with their IoT management tasks. You can provide information about devices, 
    explain alerts, suggest troubleshooting steps, and offer insights about IoT best practices.
    `

    // Use Grok AI to generate a response
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: message,
      system: systemPrompt,
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: "ai_chat",
        details: `Consulta a Grok AI: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"`,
      },
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in Grok AI chat:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
