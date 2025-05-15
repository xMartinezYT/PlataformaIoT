import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-gray-600">Cargando dashboard...</span>
    </div>
  )
}
