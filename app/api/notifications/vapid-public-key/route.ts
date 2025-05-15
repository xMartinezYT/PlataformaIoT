import { NextResponse } from "next/server"
import { publicVapidKey } from "@/lib/web-push"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ publicKey: publicVapidKey })
  } catch (error) {
    console.error("Error al obtener la clave pública VAPID:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
