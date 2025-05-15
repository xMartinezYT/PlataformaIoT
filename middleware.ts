import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Define which paths are protected and which are public
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"]
const apiPublicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    apiPublicPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value

  // If there's no token, redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)

    // Token is valid, proceed
    return NextResponse.next()
  } catch (error) {
    // Token is invalid
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
