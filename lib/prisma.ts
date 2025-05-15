import { PrismaClient } from "@prisma/client"

// Declaramos una variable global para PrismaClient
declare global {
  var prisma: PrismaClient | undefined
}

// Exportamos una instancia de PrismaClient
export const prisma = global.prisma || new PrismaClient()

// En desarrollo, guardamos la instancia en la variable global para evitar múltiples instancias
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
