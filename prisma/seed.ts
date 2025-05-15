import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  try {
    // Crear un usuario administrador si no existe
    const adminEmail = "admin@example.com"
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123")
      await prisma.user.create({
        data: {
          name: "Administrador",
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
        },
      })
      console.log("Usuario administrador creado")
    }

    // Crear categorías básicas si no existen
    const categories = [
      { name: "Sensores", description: "Dispositivos de medición", color: "#3498db", icon: "sensor" },
      { name: "Actuadores", description: "Dispositivos de control", color: "#e74c3c", icon: "switch" },
      { name: "Gateways", description: "Dispositivos de comunicación", color: "#2ecc71", icon: "router" },
    ]

    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: category.name },
      })

      if (!existingCategory) {
        await prisma.category.create({
          data: category,
        })
        console.log(`Categoría ${category.name} creada`)
      }
    }

    console.log("Seed completado correctamente")
  } catch (error) {
    console.error("Error durante el seed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
