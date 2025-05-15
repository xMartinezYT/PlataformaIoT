import { query } from "../db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  created_at: Date
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query("SELECT * FROM users WHERE id = $1", [id])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function createUser(email: string, password: string, name: string, role = "USER"): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  const id = uuidv4()

  const result = await query(
    "INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [id, email, hashedPassword, name, role],
  )

  return result.rows[0]
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    return null
  }

  return user
}

export async function getAllUsers(): Promise<User[]> {
  return await query("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC")
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const fields = Object.keys(data).filter((key) => key !== "id" && key !== "password_hash")

  if (fields.length === 0) {
    return await getUserById(id)
  }

  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
  const values = fields.map((field) => data[field as keyof typeof data])

  const result = await query(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, [
    id,
    ...values,
  ])

  return result.rows.length > 0 ? result.rows[0] : null
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id])
  return result.rows.length > 0
}

export const userService = {
  getUserByEmail,
  getUserById,
  createUser,
  validateUser,
  getAllUsers,
  updateUser,
  deleteUser,
}
