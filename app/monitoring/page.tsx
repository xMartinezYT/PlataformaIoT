"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Gauge, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeviceMetrics from "@/components/device-metrics"

export default function MonitoringPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
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
          <span className="text-foreground">Monitoreo</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Gauge className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Monitoreo en Tiempo Real</h1>
            <p className="text-muted-foreground">Visualice el estado actual de sus dispositivos IoT</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                <SelectItem value="production">Producción</SelectItem>
                <SelectItem value="warehouse">Almacén</SelectItem>
                <SelectItem value="office">Oficinas</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de dispositivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="temperature">Temperatura</SelectItem>
                <SelectItem value="humidity">Humedad</SelectItem>
                <SelectItem value="pressure">Presión</SelectItem>
                <SelectItem value="motor">Motores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="status">Estado</TabsTrigger>
            <TabsTrigger value="realtime">Tiempo Real</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <DeviceMetrics />
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Estado de Dispositivos</CardTitle>
                <CardDescription>Estado actual de todos los dispositivos monitoreados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Sensor de Temperatura A1", status: "online", value: "24.5°C", lastUpdate: "Hace 2 min" },
                    { name: "Motor Línea A", status: "warning", value: "75 RPM", lastUpdate: "Hace 3 min" },
                    { name: "Sensor de Humedad B2", status: "online", value: "48%", lastUpdate: "Hace 5 min" },
                    { name: "Sensor de Presión C3", status: "online", value: "4.2 bar", lastUpdate: "Hace 1 min" },
                    { name: "Cámara de Seguridad 1", status: "offline", value: "N/A", lastUpdate: "Hace 2 horas" },
                    { name: "Motor Línea B", status: "online", value: "80 RPM", lastUpdate: "Hace 2 min" },
                  ].map((device, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{device.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                device.status === "online"
                                  ? "bg-green-500"
                                  : device.status === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm">
                              {device.status === "online"
                                ? "Conectado"
                                : device.status === "warning"
                                  ? "Advertencia"
                                  : "Desconectado"}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{device.value}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Última actualización: {device.lastUpdate}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime">
            <Card>
              <CardHeader>
                <CardTitle>Monitoreo en Tiempo Real</CardTitle>
                <CardDescription>Datos en tiempo real de los dispositivos seleccionados</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin" />
                  <p>Cargando datos en tiempo real...</p>
                  <p className="text-sm mt-2">Los datos se actualizan automáticamente cada 5 segundos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
