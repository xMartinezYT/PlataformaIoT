import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { isTokenExpired } from "@/lib/token"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        {
          valid: false,
          error: "Token no proporcionado",
        },
        { status: 400 },
      )
    }

    // Buscar usuario con este token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
      select: { id: true, resetPasswordExpires: true },
    })

    if (!user) {
      return NextResponse.json(
        {
          valid: false,
          error: "Token inválido",
        },
        { status: 400 },
      )
    }

    // Verificar si el token ha expirado
    if (isTokenExpired(user.resetPasswordExpires)) {
      return NextResponse.json(
        {
          valid: false,
          error: "El token ha expirado",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Error al validar token:", error)
    return NextResponse.json({ valid: false, error: "Error al validar token" }, { status: 500 })
  }
}
