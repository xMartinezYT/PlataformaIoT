import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Define which paths are protected and which are public
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/"]
const apiPublicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/validate-reset-token",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/")) ||
    apiPublicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.includes("/_next") ||
    pathname.includes("/api/auth") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("/robots.txt")
  ) {
    return NextResponse.next()
  }

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          // This is used for setting cookies during SSR, but we don't need it in middleware
        },
        remove: (name, options) => {
          // This is used for removing cookies during SSR, but we don't need it in middleware
        },
      },
    },
  )

  // Get the user from Supabase
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
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
