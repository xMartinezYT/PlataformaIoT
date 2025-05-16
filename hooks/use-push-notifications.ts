"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function usePushNotifications() {
  const { data: session } = useSession()
  const [permission, setPermission] = useState<NotificationPermission | "default">("default")
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Verificar si las notificaciones están soportadas
  const isPushNotificationSupported = () => {
    return "serviceWorker" in navigator && "PushManager" in window
  }

  // Obtener el estado actual del permiso
  useEffect(() => {
    if (isPushNotificationSupported()) {
      setPermission(Notification.permission)
    }
  }, [])

  // Registrar el Service Worker
  useEffect(() => {
    if (isPushNotificationSupported() && session?.user) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          setServiceWorkerRegistration(registration)
          return registration.pushManager.getSubscription()
        })
        .then((existingSubscription) => {
          setSubscription(existingSubscription)
        })
        .catch((err) => {
          console.error("Error al registrar el Service Worker:", err)
          setError("No se pudo registrar el Service Worker")
        })
    }
  }, [session])

  // Solicitar permiso para notificaciones
  const requestPermission = async () => {
    if (!isPushNotificationSupported()) {
      setError("Las notificaciones push no están soportadas en este navegador")
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === "granted"
    } catch (err) {
      console.error("Error al solicitar permiso:", err)
      setError("No se pudo solicitar permiso para notificaciones")
      return false
    }
  }

  // Suscribirse a notificaciones push
  const subscribe = async () => {
    if (!isPushNotificationSupported() || !session?.user) {
      return false
    }

    if (permission !== "granted") {
      const granted = await requestPermission()
      if (!granted) return false
    }

    if (!serviceWorkerRegistration) {
      setError("Service Worker no registrado")
      return false
    }

    setIsSubscribing(true)
    setError(null)

    try {
      // Obtener la clave pública VAPID
      const response = await fetch("/api/notifications/vapid-public-key")
      const { publicKey } = await response.json()

      // Crear suscripción
      const pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Guardar suscripción en el servidor
      const saveResponse = await fetch("/api/notifications/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: pushSubscription,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Error al guardar la suscripción")
      }

      setSubscription(pushSubscription)
      return true
    } catch (err) {
      console.error("Error al suscribirse:", err)
      setError("No se pudo completar la suscripción a notificaciones")
      return false
    } finally {
      setIsSubscribing(false)
    }
  }

  // Cancelar suscripción
  const unsubscribe = async () => {
    if (!subscription) return false

    try {
      // Eliminar suscripción del servidor
      await fetch("/api/notifications/subscriptions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      })

      // Cancelar suscripción en el navegador
      await subscription.unsubscribe()
      setSubscription(null)
      return true
    } catch (err) {
      console.error("Error al cancelar suscripción:", err)
      setError("No se pudo cancelar la suscripción")
      return false
    }
  }

  return {
    isPushNotificationSupported: isPushNotificationSupported(),
    permission,
    subscription,
    isSubscribing,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
  }
}

// Función auxiliar para convertir la clave VAPID a Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
