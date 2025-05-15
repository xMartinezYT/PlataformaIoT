"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Estado para validación de campos
  const [validation, setValidation] = useState({
    email: { valid: false, message: "", touched: false },
    password: { valid: false, message: "", touched: false },
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar si el usuario viene de un registro exitoso
    const registered = searchParams?.get("registered")
    if (registered === "true") {
      setRegistrationSuccess(true)
    }
  }, [searchParams])

  // Validar campos cuando cambian
  useEffect(() => {
    validateField("email", formData.email)
    validateField("password", formData.password)
  }, [formData])

  // Función para validar un campo específico
  const validateField = (field: string, value: string) => {
    let isValid = false
    let message = ""

    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        isValid = emailRegex.test(value)
        message = isValid ? "" : "Ingresa un correo electrónico válido"
        break
      case "password":
        isValid = value.length >= 1 // Solo verificamos que no esté vacío
        message = isValid ? "" : "La contraseña es requerida"
        break
    }

    setValidation((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        valid: isValid,
        message,
      },
    }))
  }

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Marcar el campo como tocado
    setValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        touched: true,
      },
    }))
  }

  // Manejar cuando el campo pierde el foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof typeof prev],
        touched: true,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Marcar todos los campos como tocados para mostrar validaciones
    const touchedValidation = Object.keys(validation).reduce((acc, field) => {
      return {
        ...acc,
        [field]: {
          ...validation[field as keyof typeof validation],
          touched: true,
        },
      }
    }, {})
    setValidation(touchedValidation as typeof validation)

    // Verificar si todos los campos son válidos
    const isFormValid = Object.values(validation).every((field) => field.valid)

    if (!isFormValid) {
      setError("Por favor, corrige los errores en el formulario")
      setLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError("Credenciales inválidas")
        setLoading(false)
        return
      }

      // Login exitoso, redirigir al dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Error al iniciar sesión")
      setLoading(false)
    }
  }

  // Función para determinar la clase de estilo del campo
  const getInputClasses = (field: keyof typeof validation) => {
    const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900"

    if (!validation[field].touched) {
      return `${baseClasses} border-gray-300 focus:ring-blue-500`
    }

    return validation[field].valid
      ? `${baseClasses} border-green-500 focus:ring-green-500 pr-10`
      : `${baseClasses} border-red-500 focus:ring-red-500 pr-10`
  }

  // Generar IDs únicos para los mensajes de error
  const getErrorId = (field: string) => `login-${field}-error`

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h1>

        {/* Mensaje de registro exitoso - Accesible */}
        {registrationSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center"
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
            ¡Registro exitoso! Ahora puedes iniciar sesión.
          </div>
        )}

        {/* Alerta de error - Accesible */}
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

        {/* Formulario con etiqueta para lectores de pantalla */}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de inicio de sesión">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClasses("email")}
                disabled={loading}
                aria-invalid={validation.email.touched && !validation.email.valid}
                aria-describedby={validation.email.touched && !validation.email.valid ? getErrorId("email") : undefined}
              />
              {validation.email.touched && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {validation.email.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {validation.email.touched && !validation.email.valid && (
              <p className="mt-1 text-sm text-red-600" id={getErrorId("email")} aria-live="polite">
                {validation.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClasses("password")}
                disabled={loading}
                aria-invalid={validation.password.touched && !validation.password.valid}
                aria-describedby={
                  validation.password.touched && !validation.password.valid ? getErrorId("password") : undefined
                }
              />
              {validation.password.touched && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {validation.password.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {validation.password.touched && !validation.password.valid && (
              <p className="mt-1 text-sm text-red-600" id={getErrorId("password")} aria-live="polite">
                {validation.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            aria-busy={loading}
            aria-disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-700">
              Regístrate
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
