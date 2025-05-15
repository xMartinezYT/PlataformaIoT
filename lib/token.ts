import crypto from "crypto"

// Genera un token aleatorio para restablecimiento de contraseña
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Calcula la fecha de expiración (por defecto 1 hora)
export function getExpirationDate(hours = 1): Date {
  const expirationDate = new Date()
  expirationDate.setHours(expirationDate.getHours() + hours)
  return expirationDate
}

// Verifica si un token ha expirado
export function isTokenExpired(expirationDate: Date | null): boolean {
  if (!expirationDate) return true
  return new Date() > expirationDate
}
