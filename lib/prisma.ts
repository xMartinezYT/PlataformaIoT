import { PrismaClient } from "@prisma/client"

// Declaramos una variable global para PrismaClient
declare global {
  var prisma: PrismaClient | undefined
}

// Función para crear un cliente Prisma
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: ["error"],
    })
  } catch (error) {
    console.error("Error creating Prisma client:", error)
    throw error
  }
}

// Exportamos una instancia de PrismaClient
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  prisma = global.prisma
}

export default prisma
