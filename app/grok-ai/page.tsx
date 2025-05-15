"use client"

import type React from "react"

import { useState } from "react"

export default function GrokAIPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/grok-ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()
      setResponse(data.response || "Lo siento, no pude procesar tu solicitud.")
    } catch (error) {
      console.error("Error al comunicarse con Grok AI:", error)
      setResponse("Error al comunicarse con Grok AI. Por favor, intenta de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Grok AI</h1>
      <p className="text-gray-600 mb-4">Asistente inteligente para tu plataforma IoT.</p>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
        <p className="text-purple-700">
          Puedes preguntarme sobre tus dispositivos, alertas, o solicitar ayuda con la plataforma.
        </p>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Tu pregunta
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="¿En qué puedo ayudarte con tu plataforma IoT?"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Enviar"}
          </button>
        </form>
      </div>

      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Respuesta:</h2>
          <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  )
}
