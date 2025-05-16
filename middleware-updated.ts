import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that don't require authentication
const PUBLIC_PATHS = ["/api/login", "/api/register", "/api/check-email", "/api/reset-password"]

// Define paths that require admin access
const ADMIN_PATHS = ["/api/admin", "/api/users"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public API routes without authentication
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for API routes that need authentication
  if (pathname.startsWith("/api/")) {
    // Get the session token from the cookies
    const sessionToken = request.cookies.get("session-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // For admin routes, verify admin role
    if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
      try {
        // Verify admin role (this would typically involve decoding a JWT or similar)
        // This is a placeholder - implement your actual admin verification logic
        const isAdmin = await verifyAdminRole(sessionToken)

        if (!isAdmin) {
          return NextResponse.json({ error: "Admin access required" }, { status: 403 })
        }
      } catch (error) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 })
      }
    }

    // Add CORS headers for API routes
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Access-Control-Allow-Origin", "*") // Adjust this in production
    response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT")
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    )

    return response
  }

  // For non-API routes, just proceed
  return NextResponse.next()
}

// This is a placeholder function - implement your actual admin verification
async function verifyAdminRole(token: string): Promise<boolean> {
  // In a real implementation, you would:
  // 1. Verify the token's signature
  // 2. Check if the user has admin role
  // 3. Return true if admin, false otherwise

  // For now, we'll just return true for demonstration
  return true
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/api/:path*"],
}
