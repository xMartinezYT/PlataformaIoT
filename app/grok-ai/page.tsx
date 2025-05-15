"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function GrokAIPage() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hola, soy Grok-AI. ¿En qué puedo ayudarte con tu plataforma IoT industrial?" },
  ])
  const [loading, setLoading] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Añadir mensaje del usuario al historial
    setChatHistory([...chatHistory, { role: "user", content: message }])
    setLoading(true)

    // Simular respuesta del asistente
    setTimeout(() => {
      const responses = [
        "Basado en los datos de tus sensores, recomiendo revisar el motor de la Línea A. Los patrones de temperatura indican un posible sobrecalentamiento.",
        "He analizado el consumo energético y detecté un incremento del 15% en el área de producción. Esto podría indicar ineficiencias en los equipos.",
        "Los datos históricos muestran que el Sensor B2 tiene lecturas inconsistentes. Recomendaría programar una calibración.",
        "Según mi análisis predictivo, el Compresor C-103 podría requerir mantenimiento en los próximos 10 días. Te sugiero programarlo para evitar paradas no planificadas.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatHistory((prev) => [...prev, { role: "assistant", content: randomResponse }])
      setLoading(false)
      setMessage("")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Grok-AI</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12L11 15L16 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <h1 className="text-2xl font-bold">Grok-AI Asistente Industrial</h1>
            <p className="text-muted-foreground">
              Asistente inteligente para análisis y optimización de su planta industrial
            </p>
          </div>
        </div>

        <Tabs defaultValue="chat">
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>Asistente Grok-AI</CardTitle>
                    <CardDescription>Consulta sobre tus dispositivos, alertas y optimizaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              msg.role === "assistant"
                                ? "bg-muted text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted text-foreground">
                            <div className="flex space-x-2">
                              <div className="h-2 w-2 rounded-full bg-foreground animate-bounce"></div>
                              <div className="h-2 w-2 rounded-full bg-foreground animate-bounce delay-100"></div>
                              <div className="h-2 w-2 rounded-full bg-foreground animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        placeholder="Escribe tu mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button size="icon" onClick={handleSendMessage} disabled={loading || !message.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>Sugerencias</CardTitle>
                    <CardDescription>Preguntas frecuentes y sugerencias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                      {[
                        "¿Cuáles son los dispositivos con alertas críticas?",
                        "Analiza el consumo energético de la última semana",
                        "¿Qué dispositivos necesitarán mantenimiento pronto?",
                        "Compara la eficiencia entre la Línea A y la Línea B",
                        "Muestra las tendencias de temperatura en el área de producción",
                        "¿Cómo puedo optimizar el rendimiento de los motores?",
                        "Genera un informe de calidad para la semana actual",
                        "Predice el consumo energético para el próximo mes",
                      ].map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => {
                            setMessage(suggestion)
                          }}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Insights Automáticos</CardTitle>
                <CardDescription>Análisis inteligente de sus datos industriales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Anomalía detectada en Motor Línea A",
                      description:
                        "Se ha detectado un patrón anómalo en las vibraciones del Motor Línea A. Esto podría indicar un desgaste prematuro de los rodamientos.",
                      severity: "high",
                      time: "Hace 2 horas",
                    },
                    {
                      title: "Oportunidad de ahorro energético",
                      description:
                        "El análisis de patrones de consumo indica que se podría reducir hasta un 12% el consumo energético optimizando los ciclos de operación en horarios de baja demanda.",
                      severity: "medium",
                      time: "Hace 1 día",
                    },
                    {
                      title: "Correlación entre temperatura y calidad",
                      description:
                        "Se ha identificado una correlación significativa entre la temperatura ambiente y la tasa de defectos en la Línea B. Recomendamos ajustar la climatización.",
                      severity: "medium",
                      time: "Hace 2 días",
                    },
                    {
                      title: "Optimización de inventario",
                      description:
                        "Basado en los patrones históricos, se recomienda reducir el stock de componentes tipo A en un 15% y aumentar los de tipo C en un 10% para optimizar costos.",
                      severity: "low",
                      time: "Hace 3 días",
                    },
                  ].map((insight, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{insight.title}</h3>
                            <Badge
                              variant="outline"
                              className={
                                insight.severity === "high"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : insight.severity === "medium"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {insight.severity === "high"
                                ? "Alta prioridad"
                                : insight.severity === "medium"
                                  ? "Media prioridad"
                                  : "Baja prioridad"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{insight.time}</div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Ignorar
                        </Button>
                        <Button size="sm">Ver detalles</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Predicciones</CardTitle>
                <CardDescription>Predicciones basadas en modelos de aprendizaje automático</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Predicción de Fallos</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dispositivo</TableHead>
                            <TableHead>Componente</TableHead>
                            <TableHead>Probabilidad de Fallo</TableHead>
                            <TableHead>Tiempo Estimado</TableHead>
                            <TableHead>Impacto</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              device: "Motor Línea A",
                              component: "Rodamiento",
                              probability: 78,
                              time: "15-20 días",
                              impact: "Alto",
                            },
                            {
                              device: "Compresor C-103",
                              component: "Válvula",
                              probability: 65,
                              time: "25-30 días",
                              impact: "Medio",
                            },
                            {
                              device: "Sensor de Temperatura E5",
                              component: "Calibración",
                              probability: 42,
                              time: "40-45 días",
                              impact: "Bajo",
                            },
                          ].map((prediction, i) => (
                            <TableRow key={i}>
                              <TableCell>{prediction.device}</TableCell>
                              <TableCell>{prediction.component}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-full h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${
                                        prediction.probability > 70
                                          ? "bg-red-500"
                                          : prediction.probability > 50
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                      }`}
                                      style={{ width: `${prediction.probability}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{prediction.probability}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{prediction.time}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    prediction.impact === "Alto"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : prediction.impact === "Medio"
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        : "bg-green-50 text-green-700 border-green-200"
                                  }
                                >
                                  {prediction.impact}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Predicción de Demanda</h3>
                    <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Gráfico de predicción de demanda</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Optimización de Recursos</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        {
                          title: "Energía",
                          current: "1,284 kWh",
                          optimized: "1,150 kWh",
                          saving: "10.4%",
                        },
                        {
                          title: "Mantenimiento",
                          current: "$12,500",
                          optimized: "$10,800",
                          saving: "13.6%",
                        },
                        {
                          title: "Tiempo de Inactividad",
                          current: "8.5 horas",
                          optimized: "4.2 horas",
                          saving: "50.6%",
                        },
                      ].map((resource, i) => (
                        <Card key={i}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{resource.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="text-muted-foreground">Actual</div>
                                <div className="font-medium">{resource.current}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Optimizado</div>
                                <div className="font-medium text-green-600">{resource.optimized}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs">
                              <span className="text-green-600">Ahorro potencial: {resource.saving}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Grok-AI</CardTitle>
                <CardDescription>Personalice el comportamiento del asistente inteligente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Preferencias Generales</h3>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ai-model">Modelo de IA</Label>
                        <Select defaultValue="grok-2">
                          <SelectTrigger id="ai-model">
                            <SelectValue placeholder="Seleccionar modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grok-1">Grok-1</SelectItem>
                            <SelectItem value="grok-2">Grok-2</SelectItem>
                            <SelectItem value="grok-2-pro">Grok-2 Pro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="language">Idioma</Label>
                        <Select defaultValue="es">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Seleccionar idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="context-window">Ventana de Contexto</Label>
                        <Select defaultValue="30d">
                          <SelectTrigger id="context-window">
                            <SelectValue placeholder="Seleccionar período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 90 días</SelectItem>
                            <SelectItem value="365d">Último año</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Personalización</h3>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="system-prompt">Prompt del Sistema</Label>
                        <Textarea
                          id="system-prompt"
                          className="min-h-[100px]"
                          defaultValue="Eres Grok-AI, un asistente industrial especializado en análisis de datos IoT, optimización de procesos y mantenimiento predictivo. Tu objetivo es ayudar a mejorar la eficiencia y reducir costos en la planta industrial."
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="data-sources">Fuentes de Datos</Label>
                        <div className="space-y-2">
                          {[
                            { id: "sensors", name: "Sensores IoT", enabled: true },
                            { id: "erp", name: "Sistema ERP", enabled: true },
                            { id: "maintenance", name: "Registros de Mantenimiento", enabled: true },
                            { id: "quality", name: "Control de Calidad", enabled: false },
                            { id: "external", name: "Datos Externos (clima, mercado)", enabled: false },
                          ].map((source) => (
                            <div key={source.id} className="flex items-center space-x-2">
                              <Checkbox id={source.id} defaultChecked={source.enabled} />
                              <label
                                htmlFor={source.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {source.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Restablecer Valores</Button>
                <Button>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
