import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Obtener el email de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return new Response(JSON.stringify({ error: "Email es requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Verificar si el email ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Solo necesitamos saber si existe, no necesitamos todos los datos
    })

    return new Response(JSON.stringify({ exists: !!existingUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error al verificar email:", error)

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
