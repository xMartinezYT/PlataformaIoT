"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { LogoutButton } from "@/components/logout-button"
import { Button } from "@/components/ui/button"
import { User, Settings, BarChart3, Cpu, Bell } from "lucide-react"

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
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Bienvenido, {user.email}</h2>
        <p className="text-gray-600">ID de usuario: {user.id}</p>
        <p className="text-gray-600">Correo: {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Dispositivos</h3>
            <Cpu className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500">Dispositivos activos</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Alertas</h3>
            <Bell className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500">Alertas pendientes</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Análisis</h3>
            <BarChart3 className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500">Reportes generados</p>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Configuración</h3>
            <Settings className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm text-gray-500">Reglas configuradas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/devices">
              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <h4 className="font-medium">Gestionar Dispositivos</h4>
                <p className="text-sm text-gray-600">Añadir, editar o eliminar dispositivos</p>
              </div>
            </Link>
            <Link href="/alerts">
              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <h4 className="font-medium">Ver Alertas</h4>
                <p className="text-sm text-gray-600">Revisar y gestionar alertas</p>
              </div>
            </Link>
            <Link href="/analytics">
              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <h4 className="font-medium">Análisis de Datos</h4>
                <p className="text-sm text-gray-600">Ver estadísticas y reportes</p>
              </div>
            </Link>
            <Link href="/settings">
              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <h4 className="font-medium">Configuración</h4>
                <p className="text-sm text-gray-600">Ajustar preferencias del sistema</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center py-8">No hay actividad reciente para mostrar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
