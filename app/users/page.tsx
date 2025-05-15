export default function UsersPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      <p className="text-gray-600 mb-4">Administración de usuarios de la plataforma.</p>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
        <p className="text-green-700">
          Esta página está en construcción. Pronto podrás ver y gestionar los usuarios de la plataforma aquí.
        </p>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Añadir usuario
        </button>
      </div>
    </div>
  )
}
