export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Plataforma de Gestión IoT</h1>
      <p className="text-lg mb-4">Bienvenido a la plataforma de gestión IoT</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/login"
          className="p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-center"
        >
          Iniciar Sesión
        </a>
        <a
          href="/register"
          className="p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-center"
        >
          Registrarse
        </a>
      </div>
    </div>
  )
}
