"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Download, Maximize2, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ScadaPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10)
    }
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
          <span className="text-foreground">SCADA</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
            <line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <h1 className="text-2xl font-bold">Sistema SCADA</h1>
            <p className="text-muted-foreground">Supervisión, Control y Adquisición de Datos</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select defaultValue="plant1">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Planta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant1">Planta Principal</SelectItem>
                <SelectItem value="plant2">Planta Secundaria</SelectItem>
                <SelectItem value="plant3">Planta de Distribución</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                <SelectItem value="production">Producción</SelectItem>
                <SelectItem value="warehouse">Almacén</SelectItem>
                <SelectItem value="distribution">Distribución</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{zoomLevel}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="production">Producción</TabsTrigger>
            <TabsTrigger value="energy">Energía</TabsTrigger>
            <TabsTrigger value="hvac">HVAC</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Vista General de la Planta</CardTitle>
                <CardDescription>Supervisión en tiempo real de todos los sistemas</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded-md overflow-hidden"
                  style={{ height: "600px", transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
                >
                  <div className="relative w-full h-full bg-gray-100">
                    {/* Simulación de interfaz SCADA */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <img
                        src="/placeholder.svg?height=600&width=1200"
                        alt="SCADA Interface"
                        className="w-full h-full object-cover"
                      />

                      {/* Elementos interactivos simulados */}
                      <div className="absolute top-[20%] left-[30%] w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center cursor-pointer hover:bg-green-500/30">
                        <span className="text-xs font-bold">M1</span>
                      </div>

                      <div className="absolute top-[40%] left-[50%] w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center cursor-pointer hover:bg-yellow-500/30">
                        <span className="text-xs font-bold">M2</span>
                      </div>

                      <div className="absolute top-[60%] left-[20%] w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-blue-500/30">
                        <span className="text-xs font-bold">S1</span>
                      </div>

                      <div className="absolute top-[30%] left-[70%] w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center cursor-pointer hover:bg-red-500/30">
                        <span className="text-xs font-bold">A1</span>
                      </div>

                      {/* Líneas de conexión simuladas */}
                      <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <line x1="30%" y1="20%" x2="50%" y2="40%" stroke="gray" strokeWidth="2" />
                        <line x1="50%" y1="40%" x2="20%" y2="60%" stroke="gray" strokeWidth="2" />
                        <line x1="50%" y1="40%" x2="70%" y2="30%" stroke="gray" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle>Líneas de Producción</CardTitle>
                <CardDescription>Control y monitoreo de las líneas de producción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Vista SCADA de producción</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy">
            <Card>
              <CardHeader>
                <CardTitle>Gestión Energética</CardTitle>
                <CardDescription>Monitoreo y control de sistemas energéticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Vista SCADA de energía</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hvac">
            <Card>
              <CardHeader>
                <CardTitle>Sistemas HVAC</CardTitle>
                <CardDescription>Control de climatización y ventilación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Vista SCADA de HVAC</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Monitoreo de sistemas de seguridad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Vista SCADA de seguridad</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
