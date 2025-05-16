import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-config"

// Exportación del handler de NextAuth
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
