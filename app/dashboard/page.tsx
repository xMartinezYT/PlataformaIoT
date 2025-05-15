export default function DashboardPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Dispositivos</h2>
          <p className="text-gray-600">Gestiona tus dispositivos IoT conectados.</p>
          <a href="/devices" className="mt-4 inline-block text-blue-600 hover:underline">
            Ver dispositivos →
          </a>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Alertas</h2>
          <p className="text-gray-600">Monitorea y gestiona alertas del sistema.</p>
          <a href="/alerts" className="mt-4 inline-block text-red-600 hover:underline">
            Ver alertas →
          </a>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Usuarios</h2>
          <p className="text-gray-600">Administra los usuarios de la plataforma.</p>
          <a href="/users" className="mt-4 inline-block text-green-600 hover:underline">
            Ver usuarios →
          </a>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">Grok AI</h2>
          <p className="text-gray-600">Consulta al asistente inteligente para tu plataforma.</p>
          <a href="/grok-ai" className="mt-4 inline-block text-purple-600 hover:underline">
            Abrir Grok AI →
          </a>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-700 mb-2">SCADA</h2>
          <p className="text-gray-600">Visualiza y controla tus dispositivos en tiempo real.</p>
          <a href="/scada" className="mt-4 inline-block text-yellow-600 hover:underline">
            Abrir SCADA →
          </a>
        </div>
      </div>
    </div>
  )
}
