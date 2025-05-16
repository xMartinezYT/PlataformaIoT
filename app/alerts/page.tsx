export default function AlertsPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Alertas</h1>
      <p className="text-gray-600 mb-4">Monitoreo y gestión de alertas del sistema.</p>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <p className="text-red-700">
          Esta página está en construcción. Pronto podrás ver y gestionar las alertas de tus dispositivos aquí.
        </p>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Crear alerta
        </button>
      </div>
    </div>
  )
}
