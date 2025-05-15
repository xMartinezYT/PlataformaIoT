"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { debounce } from "lodash" // Asegúrate de instalar lodash si no lo tienes

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Estado para validación de campos
  const [validation, setValidation] = useState({
    name: { valid: false, message: "", touched: false },
    email: { valid: false, message: "", touched: false, checking: false, exists: false },
    password: { valid: false, message: "", touched: false },
    confirmPassword: { valid: false, message: "", touched: false },
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Función debounced para verificar email
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkEmailExists = useCallback(
    debounce(async (email: string) => {
      if (!email || !validation.email.valid) {
        return
      }

      try {
        setValidation((prev) => ({
          ...prev,
          email: { ...prev.email, checking: true },
        }))

        const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
        const data = await response.json()

        setValidation((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            checking: false,
            exists: data.exists,
            valid: !data.exists && prev.email.valid,
            message: data.exists ? "Este email ya está registrado" : prev.email.message,
          },
        }))
      } catch (error) {
        console.error("Error al verificar email:", error)
        setValidation((prev) => ({
          ...prev,
          email: { ...prev.email, checking: false },
        }))
      }
    }, 500),
    [],
  )

  // Validar campos cuando cambian
  useEffect(() => {
    validateField("name", formData.name)
    validateField("email", formData.email)
    validateField("password", formData.password)
    validateField("confirmPassword", formData.confirmPassword)
  }, [formData])

  // Verificar email cuando cambia y es válido
  useEffect(() => {
    if (validation.email.valid && validation.email.touched && !validation.email.checking) {
      checkEmailExists(formData.email)
    }
  }, [formData.email, validation.email.valid, validation.email.touched, checkEmailExists])

  // Función para validar un campo específico
  const validateField = (field: string, value: string) => {
    let isValid = false
    let message = ""

    switch (field) {
      case "name":
        isValid = value.trim().length >= 3
        message = isValid ? "" : "El nombre debe tener al menos 3 caracteres"
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        isValid = emailRegex.test(value)
        message = isValid ? "" : "Ingresa un correo electrónico válido"
        break
      case "password":
        isValid = value.length >= 6
        message = isValid ? "" : "La contraseña debe tener al menos 6 caracteres"
        break
      case "confirmPassword":
        isValid = value === formData.password && value.length > 0
        message = isValid ? "" : "Las contraseñas no coinciden"
        break
    }

    setValidation((prev) => {
      // Para el email, conservamos el estado de checking y exists
      if (field === "email") {
        return {
          ...prev,
          [field]: {
            ...prev[field as keyof typeof prev],
            valid: isValid,
            message,
            // Si el valor cambió, reiniciamos el estado de exists
            exists: value === formData.email ? prev.email.exists : false,
          },
        }
      }

      return {
        ...prev,
        [field]: {
          ...prev[field as keyof typeof prev],
          valid: isValid,
          message,
        },
      }
    })
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

    // Verificar si el email ya existe (doble verificación)
    try {
      const emailCheckResponse = await fetch(`/api/check-email?email=${encodeURIComponent(formData.email)}`)
      const emailCheckData = await emailCheckResponse.json()

      if (emailCheckData.exists) {
        setValidation((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            valid: false,
            exists: true,
            message: "Este email ya está registrado",
          },
        }))
        setError("El email ya está registrado. Por favor, usa otro email.")
        setLoading(false)
        return
      }

      // Continuar con el registro si el email no existe
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      // Verificar si la respuesta es JSON válido
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("Error al parsear la respuesta:", jsonError)
        throw new Error("Error en el servidor: respuesta inválida")
      }

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario")
      }

      // Registro exitoso
      setSuccess(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/login?registered=true")
      }, 2000)
    } catch (error: any) {
      console.error("Error al registrar:", error)
      setError(error.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  // Función para determinar la clase de estilo del campo
  const getInputClasses = (field: keyof typeof validation) => {
    const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900"

    if (!validation[field].touched) {
      return `${baseClasses} border-gray-300 focus:ring-blue-500`
    }

    // Para el email, si está verificando, mostramos un estilo neutral
    if (field === "email" && validation.email.checking) {
      return `${baseClasses} border-yellow-300 focus:ring-yellow-500 pr-10`
    }

    return validation[field].valid
      ? `${baseClasses} border-green-500 focus:ring-green-500 pr-10`
      : `${baseClasses} border-red-500 focus:ring-red-500 pr-10`
  }

  // Generar IDs únicos para los mensajes de error
  const getErrorId = (field: string) => `${field}-error`

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h1>

        {/* Alerta de error general - Accesible */}
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

        {/* Alerta de éxito - Accesible */}
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center"
            role="status"
            aria-live="polite"
          >
            <CheckCircle className="h-5 w-5 mr-2" aria-hidden="true" />
            ¡Registro exitoso! Redirigiendo al inicio de sesión...
          </div>
        )}

        {/* Región de formulario con etiqueta para lectores de pantalla */}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulario de registro">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClasses("name")}
                disabled={loading || success}
                aria-invalid={validation.name.touched && !validation.name.valid}
                aria-describedby={validation.name.touched && !validation.name.valid ? getErrorId("name") : undefined}
              />
              {validation.name.touched && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {validation.name.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {validation.name.touched && !validation.name.valid && (
              <p className="mt-1 text-sm text-red-600" id={getErrorId("name")} aria-live="polite">
                {validation.name.message}
              </p>
            )}
          </div>

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
                disabled={loading || success}
                aria-invalid={validation.email.touched && !validation.email.valid}
                aria-describedby={validation.email.touched && !validation.email.valid ? getErrorId("email") : undefined}
              />
              {validation.email.touched && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {validation.email.checking ? (
                    <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" aria-hidden="true" />
                  ) : validation.email.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {validation.email.touched && validation.email.checking && (
              <p className="mt-1 text-sm text-yellow-600" id="email-checking" aria-live="polite">
                Verificando disponibilidad del email...
              </p>
            )}
            {validation.email.touched && !validation.email.checking && !validation.email.valid && (
              <p className="mt-1 text-sm text-red-600" id={getErrorId("email")} aria-live="polite">
                {validation.email.exists ? "Este email ya está registrado" : validation.email.message}
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
                disabled={loading || success}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClasses("confirmPassword")}
                disabled={loading || success}
                aria-invalid={validation.confirmPassword.touched && !validation.confirmPassword.valid}
                aria-describedby={
                  validation.confirmPassword.touched && !validation.confirmPassword.valid
                    ? getErrorId("confirmPassword")
                    : undefined
                }
              />
              {validation.confirmPassword.touched && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {validation.confirmPassword.valid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {validation.confirmPassword.touched && !validation.confirmPassword.valid && (
              <p className="mt-1 text-sm text-red-600" id={getErrorId("confirmPassword")} aria-live="polite">
                {validation.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            aria-busy={loading}
            aria-disabled={loading || success}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Inicia sesión
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
