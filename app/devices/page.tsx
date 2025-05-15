export default function DevicesPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Dispositivos</h1>
      <p className="text-gray-600 mb-4">Gestión de dispositivos IoT conectados a la plataforma.</p>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <p className="text-blue-700">
          Esta página está en construcción. Pronto podrás ver y gestionar tus dispositivos IoT aquí.
        </p>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Añadir dispositivo
        </button>
      </div>
    </div>
  )
}
