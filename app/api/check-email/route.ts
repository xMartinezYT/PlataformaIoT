import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Obtener el email de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Verificar si el email ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Solo necesitamos saber si existe, no necesitamos todos los datos
    })

    return NextResponse.json({ exists: !!existingUser })
  } catch (error) {
    console.error("Error al verificar email:", error)

    // Asegurarse de devolver siempre una respuesta JSON válida
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
