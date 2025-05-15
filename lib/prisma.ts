import { PrismaClient } from "@prisma/client"

// PrismaClient es adjuntado al objeto `global` en desarrollo para prevenir
// agotar el límite de conexiones a la base de datos.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Inicializar PrismaClient con manejo de errores
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  } catch (error) {
    console.error("Error initializing Prisma Client:", error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
