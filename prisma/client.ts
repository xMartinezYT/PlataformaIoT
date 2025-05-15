import { PrismaClient } from "@prisma/client"

// Exportamos una nueva instancia de PrismaClient
// Este archivo se puede usar como alternativa si hay problemas con lib/prisma.ts
export const prisma = new PrismaClient()
export default prisma
