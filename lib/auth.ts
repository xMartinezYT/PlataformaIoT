import { compare, hash } from "bcryptjs"

// Exportación nombrada de hashPassword
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Exportación nombrada de excludePassword
export function excludePassword<User>(user: User): Omit<User, "password"> {
  const { password, ...userWithoutPassword } = user as any
  return userWithoutPassword
}
