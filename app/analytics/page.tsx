"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, ChevronRight, Download, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import EfficiencyChart from "@/components/analytics/efficiency-chart"
import EnergyConsumptionChart from "@/components/analytics/energy-consumption-chart"
import ProductionKpis from "@/components/analytics/production-kpis"
import MaintenancePrediction from "@/components/analytics/maintenance-prediction"
import QualityMetrics from "@/components/analytics/quality-metrics"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [date, setDate] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

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
          <span className="text-foreground">Análisis</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Análisis y Métricas</h1>
            <p className="text-muted-foreground">Visualice y analice el rendimiento de su planta industrial</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {timeRange === "custom" && <DatePickerWithRange date={date} setDate={setDate} />}
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avanzados
          </Button>
        </div>

        <Tabs defaultValue="production">
          <TabsList className="mb-4">
            <TabsTrigger value="production">Producción</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
            <TabsTrigger value="energy">Energía</TabsTrigger>
            <TabsTrigger value="quality">Calidad</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-6">
            <ProductionKpis />

            <Card>
              <CardHeader>
                <CardTitle>Producción por Línea</CardTitle>
                <CardDescription>Unidades producidas por línea de producción</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EfficiencyChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">OEE (Eficiencia General)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78.5%</div>
                  <p className="text-xs text-muted-foreground">+2.5% respecto al período anterior</p>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "78.5%" }}></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92.3%</div>
                  <p className="text-xs text-muted-foreground">+1.7% respecto al período anterior</p>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "92.3%" }}></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.1%</div>
                  <p className="text-xs text-muted-foreground">+3.2% respecto al período anterior</p>
                  <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: "85.1%" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Eficiencia por Línea</CardTitle>
                <CardDescription>Análisis de eficiencia por línea de producción</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EfficiencyChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284 kWh</div>
                  <p className="text-xs text-muted-foreground">-5.2% respecto al período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Costo Energético</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$256.80</div>
                  <p className="text-xs text-muted-foreground">-5.2% respecto al período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Emisiones CO2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">642 kg</div>
                  <p className="text-xs text-muted-foreground">-5.2% respecto al período anterior</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Consumo Energético</CardTitle>
                <CardDescription>Análisis de consumo energético por área</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EnergyConsumptionChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <QualityMetrics />

            <Card>
              <CardHeader>
                <CardTitle>Defectos por Categoría</CardTitle>
                <CardDescription>Análisis de defectos por tipo y línea de producción</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Gráfico de defectos por categoría
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">MTBF</CardTitle>
                  <CardDescription>Tiempo medio entre fallos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">168.5 horas</div>
                  <p className="text-xs text-muted-foreground">+12.3% respecto al período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">MTTR</CardTitle>
                  <CardDescription>Tiempo medio de reparación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 horas</div>
                  <p className="text-xs text-muted-foreground">-8.5% respecto al período anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.1%</div>
                  <p className="text-xs text-muted-foreground">+1.2% respecto al período anterior</p>
                </CardContent>
              </Card>
            </div>

            <MaintenancePrediction />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
