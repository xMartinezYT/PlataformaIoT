import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Iniciando configuración de la base de datos...")

    // Crear un usuario administrador
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
    } else {
      console.log("El usuario administrador ya existe")
    }

    // Crear categorías básicas
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
      } else {
        console.log(`La categoría ${category.name} ya existe`)
      }
    }

    console.log("Configuración de la base de datos completada")
  } catch (error) {
    console.error("Error durante la configuración de la base de datos:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
