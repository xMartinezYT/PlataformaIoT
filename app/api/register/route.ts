import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nombre, email y contraseña son obligatorios" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe un usuario con este email" }, { status: 400 })
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Rol por defecto
      },
    })

    // Crear actividad de registro
    await prisma.activity.create({
      data: {
        userId: user.id,
        action: "register",
        details: "Nuevo usuario registrado",
      },
    })

    // Devolver usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
