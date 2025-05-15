import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Obtener los datos de la solicitud
    const data = await request.json()
    console.log("Datos recibidos:", data)

    const { name, email, password } = data

    // Validación básica
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Nombre, email y contraseña son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Ya existe un usuario con este email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
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
    try {
      await prisma.activity.create({
        data: {
          userId: user.id,
          action: "register",
          details: "Nuevo usuario registrado",
        },
      })
    } catch (activityError) {
      console.error("Error al crear actividad:", activityError)
      // No fallamos el registro si falla la creación de la actividad
    }

    // Devolver usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user
    return new Response(JSON.stringify(userWithoutPassword), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error al registrar usuario:", error)

    // Asegurarse de devolver siempre una respuesta JSON válida
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
