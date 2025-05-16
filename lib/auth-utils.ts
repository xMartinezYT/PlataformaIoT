import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { userService } from "./services/user-service"

export type AuthUser = {
  id: string
  email: string
  role: string
}

export async function getUserFromRequest(request: Request): Promise<AuthUser | null> {
  // Try to get token from cookie
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  // If no token in cookie, try Authorization header
  const authHeader = request.headers.get("Authorization")
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

  const finalToken = token || headerToken

  if (!finalToken) {
    return null
  }

  try {
    const decoded = verify(finalToken, process.env.JWT_SECRET || "your-secret-key") as AuthUser

    // Verify user exists
    const user = await userService.getUserById(decoded.id)
    if (!user) {
      return null
    }

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}
