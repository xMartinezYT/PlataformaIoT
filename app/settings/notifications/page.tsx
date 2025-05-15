"use client"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuración de Notificaciones</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <NotificationSettings />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Tipos de Notificaciones</h2>

          <p className="mt-2 text-sm text-gray-600">Recibirás notificaciones para los siguientes eventos críticos:</p>

          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-800">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">Alertas críticas y de alta prioridad</span> - Notificaciones
                inmediatas cuando se detecten problemas graves en tus dispositivos.
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-800">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">Mantenimientos urgentes</span> - Avisos sobre mantenimientos
                no programados que requieren atención inmediata.
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">Cambios de estado de dispositivos</span> - Notificaciones
                cuando tus dispositivos pasen a estado de error o se desconecten.
              </p>
            </li>
            <li className="flex items-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-800">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="ml-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">Alertas de seguridad</span> - Notificaciones sobre posibles
                problemas de seguridad en tu cuenta o dispositivos.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
