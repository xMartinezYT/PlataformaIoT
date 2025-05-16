"use client"

import { useState } from "react"
import { Bell, BellOff, AlertTriangle, Info, Loader2 } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"

export function NotificationSettings() {
  const { isPushNotificationSupported, permission, subscription, isSubscribing, error, subscribe, unsubscribe } =
    usePushNotifications()

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    const success = await subscribe()
    setIsLoading(false)

    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    await unsubscribe()
    setIsLoading(false)
  }

  if (!isPushNotificationSupported) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Notificaciones no soportadas</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Tu navegador no soporta notificaciones push. Para recibir alertas en tiempo real, por favor utiliza un
                navegador moderno como Chrome, Firefox, Edge o Safari.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900">Notificaciones Push</h2>

      <p className="mt-2 text-sm text-gray-600">
        Recibe alertas en tiempo real sobre eventos críticos, incluso cuando no estés usando la plataforma.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="mt-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">¡Notificaciones activadas correctamente!</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium text-gray-900">Estado:</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                subscription ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {subscription ? "Activadas" : "Desactivadas"}
            </span>
          </div>

          <div className="flex items-center">
            {subscription ? (
              <button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Desactivando...
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Desactivar
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activando...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Activar
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            {permission === "granted"
              ? "Has concedido permiso para recibir notificaciones."
              : "Necesitarás conceder permiso en tu navegador cuando actives las notificaciones."}
          </p>
        </div>
      </div>
    </div>
  )
}
