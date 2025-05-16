"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { LogoutButton } from "@/components/logout-button"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Error getting user:", error.message)
          throw error
        }

        if (data?.user) {
          console.log("Dashboard: User found", data.user.id)
          setUser(data.user)
        } else {
          console.log("Dashboard: No user found, redirecting to login")
          router.push("/login")
        }
      } catch (error) {
        console.error("Dashboard error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Bienvenido, {user.email}</h2>
        <p className="text-gray-600">ID de usuario: {user.id}</p>
        <p className="text-gray-600">Correo: {user.email}</p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Acciones rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Dispositivos</h4>
              <p className="text-sm text-gray-600">Gestiona tus dispositivos IoT</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium">Alertas</h4>
              <p className="text-sm text-gray-600">Revisa alertas recientes</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium">Análisis</h4>
              <p className="text-sm text-gray-600">Ver estadísticas y reportes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
