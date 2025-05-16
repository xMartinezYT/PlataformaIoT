import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

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

  // Create a Supabase client for the middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session, redirect to login
  if (!session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // User is authenticated, allow access
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
