export default function ScadaPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">SCADA</h1>
      <p className="text-gray-600 mb-4">Sistema de supervisión, control y adquisición de datos.</p>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <p className="text-yellow-700">
          Esta página está en construcción. Pronto podrás visualizar y controlar tus dispositivos en tiempo real aquí.
        </p>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
          Configurar vista
        </button>
      </div>
    </div>
  )
}
