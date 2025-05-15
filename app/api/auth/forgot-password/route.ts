import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateResetToken, getExpirationDate } from "@/lib/token"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "El correo electrónico es requerido" }, { status: 400 })
    }

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // No revelar si el usuario existe o no por razones de seguridad
    if (!user) {
      // En producción, no revelaríamos que el usuario no existe
      // Simularíamos un éxito para evitar enumeración de usuarios
      return NextResponse.json({ success: true })
    }

    // Generar token de restablecimiento
    const resetToken = generateResetToken()
    const resetExpires = getExpirationDate(1) // 1 hora de validez

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    })

    // Construir URL de restablecimiento
    const baseUrl = process.env.NEXTAUTH_URL || `${request.headers.get("origin")}`
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    // En producción, aquí enviaríamos un email con el enlace
    // Por ahora, solo devolvemos el enlace para demostración

    // Registrar actividad
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "password_reset_request",
        details: "Solicitud de restablecimiento de contraseña",
      },
    })

    return NextResponse.json({
      success: true,
      resetLink: resetUrl, // Solo para demostración
    })
  } catch (error) {
    console.error("Error en solicitud de restablecimiento:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
