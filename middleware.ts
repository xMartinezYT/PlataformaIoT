import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for a protected route
  const path = req.nextUrl.pathname
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/devices") ||
    path.startsWith("/alerts") ||
    path.startsWith("/users") ||
    path.startsWith("/settings") ||
    path.startsWith("/grok-ai") ||
    path.startsWith("/scada")

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)"],
}
