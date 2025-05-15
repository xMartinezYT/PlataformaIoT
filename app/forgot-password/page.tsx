"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [resetLink, setResetLink] = useState("") // Solo para demostración

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)
    setResetLink("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ha ocurrido un error")
      }

      setSuccess(true)

      // En un entorno de producción, el enlace se enviaría por email
      // Esto es solo para demostración
      if (data.resetLink) {
        setResetLink(data.resetLink)
      }
    } catch (err: any) {
      setError(err.message || "Ha ocurrido un error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Recuperar Contraseña</h1>

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
          <div className="space-y-4">
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
              Se ha enviado un enlace de recuperación a tu correo electrónico.
            </div>

            {/* Solo para demostración - En producción, esto no se mostraría */}
            {resetLink && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-sm text-yellow-800 font-medium mb-2">Enlace de demostración:</p>
                <div className="bg-white p-2 rounded border border-yellow-300 text-xs break-all">
                  <Link href={resetLink} className="text-blue-600 hover:underline">
                    {resetLink}
                  </Link>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Nota: En un entorno de producción, este enlace se enviaría por email.
                </p>
              </div>
            )}

            <div className="text-center mt-4">
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={isSubmitting}
                placeholder="Ingresa tu correo electrónico"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ingresa el correo electrónico asociado a tu cuenta para recibir un enlace de recuperación.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </button>

            <div className="text-center mt-4">
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
