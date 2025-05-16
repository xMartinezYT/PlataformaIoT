import { query, transaction, DatabaseError, DatabaseErrorType } from "../enhanced-db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  created_at: Date
}

class UserServiceError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message)
    this.name = "UserServiceError"
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query<any[]>("SELECT * FROM users WHERE email = $1", [email])
    return result.length > 0 ? result[0] : null
  } catch (error) {
    if (error instanceof DatabaseError) {
      // Handle specific database errors
      if (error.type === DatabaseErrorType.CONNECTION) {
        throw new UserServiceError("Database connection error while fetching user", error)
      }
    }
    throw new UserServiceError(`Failed to get user by email: ${(error as Error).message}`, error as Error)
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await query<any[]>("SELECT * FROM users WHERE id = $1", [id])
    return result.length > 0 ? result[0] : null
  } catch (error) {
    throw new UserServiceError(`Failed to get user by ID: ${(error as Error).message}`, error as Error)
  }
}

export async function createUser(email: string, password: string, name: string, role = "USER"): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const id = uuidv4()

    return await transaction(async (sql) => {
      // Check if user already exists
      const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
      if (existingUser.length > 0) {
        throw new UserServiceError(`User with email ${email} already exists`)
      }

      // Create the user
      const result = await sql`
        INSERT INTO users (id, email, password_hash, name, role) 
        VALUES (${id}, ${email}, ${hashedPassword}, ${name}, ${role}) 
        RETURNING *
      `
      return result[0]
    })
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error
    }
    throw new UserServiceError(`Failed to create user: ${(error as Error).message}`, error as Error)
  }
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return null
    }

    return user
  } catch (error) {
    throw new UserServiceError(`Failed to validate user: ${(error as Error).message}`, error as Error)
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    return await query<User[]>("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC")
  } catch (error) {
    throw new UserServiceError(`Failed to get all users: ${(error as Error).message}`, error as Error)
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const fields = Object.keys(data).filter((key) => key !== "id" && key !== "password_hash")

    if (fields.length === 0) {
      return await getUserById(id)
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(", ")
    const values = fields.map((field) => data[field as keyof typeof data])

    const result = await query<any[]>(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, [
      id,
      ...values,
    ])

    return result.length > 0 ? result[0] : null
  } catch (error) {
    throw new UserServiceError(`Failed to update user: ${(error as Error).message}`, error as Error)
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await query<any[]>("DELETE FROM users WHERE id = $1 RETURNING id", [id])
    return result.length > 0
  } catch (error) {
    throw new UserServiceError(`Failed to delete user: ${(error as Error).message}`, error as Error)
  }
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
