"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Logout error:", error.message)
        throw error
      }

      console.log("Logged out successfully")

      // Use multiple navigation methods for redundancy
      router.push("/login")

      // Fallback direct navigation
      setTimeout(() => {
        window.location.href = "/login"
      }, 300)
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cerrando sesión...
        </>
      ) : (
        "Cerrar sesión"
      )}
    </Button>
  )
}
