import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/forgot-password"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect authenticated users away from public paths
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/devices/:path*",
    "/analytics/:path*",
    "/automation/:path*",
    "/inventory/:path*",
    "/settings/:path*",
    "/monitoring/:path*",
    "/alerts/:path*",
    "/users/:path*",
    "/grok-ai/:path*",
    "/scada/:path*",
  ],
}
