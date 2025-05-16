"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import AutomationRuleDialog from "@/components/automation/automation-rule-dialog"
import AutomationHistory from "@/components/automation/automation-history"

const automationRules = [
  {
    id: "rule-001",
    name: "Alerta de temperatura alta",
    description: "Enviar alerta cuando la temperatura supere los 80°C",
    trigger: "Temperatura > 80°C",
    action: "Enviar alerta por email y SMS",
    status: "active",
    lastTriggered: "Hace 2 días",
    priority: "high",
  },
  {
    id: "rule-002",
    name: "Apagado automático",
    description: "Apagar dispositivo cuando la temperatura supere los 95°C",
    trigger: "Temperatura > 95°C",
    action: "Apagar dispositivo",
    status: "active",
    lastTriggered: "Nunca",
    priority: "critical",
  },
  {
    id: "rule-003",
    name: "Notificación de mantenimiento",
    description: "Programar mantenimiento cuando las horas de operación superen 5000",
    trigger: "Horas de operación > 5000",
    action: "Crear tarea de mantenimiento",
    status: "active",
    lastTriggered: "Hace 1 semana",
    priority: "medium",
  },
  {
    id: "rule-004",
    name: "Alerta de batería baja",
    description: "Enviar alerta cuando la batería sea menor al 20%",
    trigger: "Nivel de batería < 20%",
    action: "Enviar alerta por email",
    status: "inactive",
    lastTriggered: "Hace 1 mes",
    priority: "low",
  },
  {
    id: "rule-005",
    name: "Reporte diario de producción",
    description: "Generar y enviar reporte diario de producción",
    trigger: "Programado - 23:00 diariamente",
    action: "Generar reporte y enviar por email",
    status: "active",
    lastTriggered: "Ayer",
    priority: "medium",
  },
]

export default function AutomationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredRules = automationRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.trigger.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <span className="text-foreground">Automatización</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Zap className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Automatización y Reglas</h1>
            <p className="text-muted-foreground">Configure reglas y automatizaciones para sus dispositivos IoT</p>
          </div>
        </div>

        <Tabs defaultValue="rules">
          <TabsList className="mb-4">
            <TabsTrigger value="rules">Reglas</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar reglas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Regla
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredRules.map((rule) => (
                <Card key={rule.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            rule.priority === "critical"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : rule.priority === "high"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : rule.priority === "medium"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          {rule.priority === "critical"
                            ? "Crítica"
                            : rule.priority === "high"
                              ? "Alta"
                              : rule.priority === "medium"
                                ? "Media"
                                : "Baja"}
                        </Badge>
                      </div>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Switch checked={rule.status === "active"} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Disparador</h4>
                        <p className="text-sm text-muted-foreground">{rule.trigger}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Acción</h4>
                        <p className="text-sm text-muted-foreground">{rule.action}</p>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between py-3">
                    <div className="text-xs text-muted-foreground">Última activación: {rule.lastTriggered}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Eliminar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <AutomationHistory />
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Alerta de temperatura</CardTitle>
                  <CardDescription>Enviar alerta cuando la temperatura supere un umbral</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plantilla para crear reglas de alerta basadas en umbrales de temperatura. Personalizable para
                    diferentes dispositivos y niveles de alerta.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Usar Plantilla</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mantenimiento programado</CardTitle>
                  <CardDescription>Programar mantenimiento basado en horas de operación</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plantilla para crear reglas de mantenimiento preventivo basadas en las horas de operación de los
                    dispositivos.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Usar Plantilla</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reporte automático</CardTitle>
                  <CardDescription>Generar y enviar reportes periódicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plantilla para crear reglas de generación y envío automático de reportes con periodicidad
                    configurable.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Usar Plantilla</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AutomationRuleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
