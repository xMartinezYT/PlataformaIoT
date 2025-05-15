import { PrismaClient } from "@prisma/client"

// Declaramos una variable global para PrismaClient
declare global {
  var prisma: PrismaClient | undefined
}

// Creamos una instancia de PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Exportamos una instancia de PrismaClient
const prisma = globalThis.prisma ?? prismaClientSingleton()

// En desarrollo, guardamos la instancia en la variable global para evitar múltiples instancias
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}

export default prisma
