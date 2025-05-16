// Service Worker para manejar notificaciones push
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.message,
      icon: "/icons/notification-icon.png",
      badge: "/icons/badge-icon.png",
      data: {
        url: data.url || "/",
      },
      actions: data.actions || [],
      tag: data.tag || "default",
      renotify: data.renotify || false,
      requireInteraction: data.requireInteraction || false,
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Manejar clic en la notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // Navegar a la URL especificada en la notificación
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
