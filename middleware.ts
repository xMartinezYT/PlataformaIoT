import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Rutas que no requieren autenticación
  const publicPaths = ["/", "/login", "/register", "/api/auth"]
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api/auth (NextAuth.js endpoints)
     * 2. /_next (Next.js internals)
     * 3. /fonts (recursos estáticos)
     * 4. /favicon.ico (favicon)
     */
    "/((?!api/auth|_next|fonts|favicon.ico).*)",
  ],
}
