"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenError, setTokenError] = useState("")
  const [isValidating, setIsValidating] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")

  // Validar el token al cargar la página
  useEffect(() => {
    if (!token) {
      setTokenError("Token de restablecimiento no proporcionado")
      setIsValidating(false)
      return
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-reset-token?token=${token}`)
        const data = await response.json()

        if (!response.ok || !data.valid) {
          setTokenError(data.error || "Token inválido o expirado")
        }
      } catch (err) {
        setTokenError("Error al validar el token")
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ha ocurrido un error")
      }

      setSuccess(true)

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login?reset=true")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Ha ocurrido un error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar estado de carga
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Validando token de restablecimiento...</p>
        </div>
      </div>
    )
  }

  // Mostrar error de token
  if (tokenError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Enlace inválido</h1>
            <p className="text-gray-600">{tokenError}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
            <p className="text-sm text-yellow-800">
              El enlace de restablecimiento puede haber expirado o ya ha sido utilizado. Por favor, solicita un nuevo
              enlace de restablecimiento.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Solicitar nuevo enlace
            </Link>

            <div className="mt-4">
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Establecer nueva contraseña</h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 mr-2" aria-hidden="true" />
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              ¡Contraseña actualizada con éxito!
            </div>

            <p className="text-gray-600 mb-6">Serás redirigido a la página de inicio de sesión en unos segundos...</p>

            <Link
              href="/login"
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ir al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={isSubmitting}
                minLength={6}
              />
              <p className="mt-1 text-sm text-gray-500">Debe tener al menos 6 caracteres.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                  Actualizando...
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Cancelar y volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
