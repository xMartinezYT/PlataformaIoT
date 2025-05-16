import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which paths are protected and which are public
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/", "/api"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/")) ||
    pathname.includes("/_next") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/robots.txt")
  ) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const supabaseSession = request.cookies.get("sb-session")

  // If there's no session, redirect to login
  if (!supabaseSession) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
