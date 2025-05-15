import { query } from "../db"
import bcrypt from "bcryptjs"

export type User = {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
  updated_at: string
}

export const userService = {
  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const result = await query("SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = $1", [id])
    return result.rows[0] || null
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await query("SELECT id, email, name, role, created_at, updated_at FROM users WHERE email = $1", [
      email,
    ])
    return result.rows[0] || null
  },

  // Create user
  async createUser(email: string, password: string, name: string, role = "USER"): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await query(
      "INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at, updated_at",
      [email, hashedPassword, name, role],
    )
    return result.rows[0]
  },

  // Verify password
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const result = await query("SELECT * FROM users WHERE email = $1", [email])
    const user = result.rows[0]

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) return null

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { name, role } = updates
    const result = await query(
      "UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), updated_at = NOW() WHERE id = $3 RETURNING id, email, name, role, created_at, updated_at",
      [name, role, id],
    )
    return result.rows[0]
  },
}
