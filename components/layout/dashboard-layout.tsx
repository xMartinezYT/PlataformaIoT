"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  IoT Platform
                </Link>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-4">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/devices"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Dispositivos
                </Link>
                <Link
                  href="/alerts"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Alertas
                </Link>
                <Link href="/users" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Usuarios
                </Link>
                <Link
                  href="/grok-ai"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Grok AI
                </Link>
                <Link href="/scada" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50">
                  SCADA
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      {session?.user?.name || session?.user?.email}
                    </span>
                    <button
                      onClick={() => router.push("/api/auth/signout")}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
