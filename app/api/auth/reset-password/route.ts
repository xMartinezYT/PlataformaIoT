import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { isTokenExpired } from "@/lib/token"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Token y contraseña son requeridos",
        },
        { status: 400 },
      )
    }

    // Buscar usuario con este token
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: "Token inválido",
        },
        { status: 400 },
      )
    }

    // Verificar si el token ha expirado
    if (isTokenExpired(user.resetPasswordExpires)) {
      return NextResponse.json(
        {
          error: "El token ha expirado",
        },
        { status: 400 },
      )
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await hashPassword(password)

    // Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    // Registrar actividad
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "password_reset_complete",
        details: "Contraseña restablecida exitosamente",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al restablecer contraseña:", error)
    return NextResponse.json({ error: "Error al restablecer contraseña" }, { status: 500 })
  }
}
