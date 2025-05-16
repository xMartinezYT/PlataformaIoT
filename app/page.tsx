"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  Factory,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Power,
  Settings,
  Thermometer,
  Users,
  Wifi,
  Package,
  Zap,
} from "lucide-react"
import DeviceTable from "@/components/device-table"
import DeviceMetrics from "@/components/device-metrics"
import AlertsPanel from "@/components/alerts-panel"
import ReportGenerator from "@/components/report-generator"
import { useAuth } from "@/contexts/auth-context"
import { useWebSocket } from "@/contexts/websocket-context"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const { user, logout } = useAuth()
  const { isConnected, lastMessage } = useWebSocket()
  const { toast } = useToast()
  const [deviceStats, setDeviceStats] = useState({
    active: 42,
    total: 48,
    temperature: "24.3°C",
    tempChange: "+1.2°C",
    energy: "284 kWh",
    energyChange: "-5%",
    alerts: 3,
    alertsDetail: "2 críticas, 1 advertencia",
  })

  // Efecto para actualizar los datos en tiempo real
  useEffect(() => {
    if (lastMessage && lastMessage.type === "deviceUpdates") {
      // Actualizar estadísticas basadas en los datos recibidos
      const updates = lastMessage.devices

      // Buscar actualizaciones para SEN-001 (sensor de temperatura)
      const tempSensor = updates.find((d: any) => d.id === "SEN-001")
      if (tempSensor) {
        setDeviceStats((prev) => ({
          ...prev,
          temperature: tempSensor.lastReading,
          tempChange:
            Number.parseFloat(tempSensor.lastReading) > 24.3
              ? "+" + (Number.parseFloat(tempSensor.lastReading) - 24.3).toFixed(1) + "°C"
              : "-" + (24.3 - Number.parseFloat(tempSensor.lastReading)).toFixed(1) + "°C",
        }))
      }

      // Actualizar conteo de dispositivos activos
      const activeCount = updates.filter((d: any) => d.status === "online").length
      if (activeCount !== updates.length) {
        setDeviceStats((prev) => ({
          ...prev,
          active: 40 + activeCount,
        }))
      }

      // Notificar al usuario sobre la actualización
      toast({
        title: "Datos actualizados",
        description: `Se han recibido nuevos datos de ${updates.length} dispositivos.`,
        duration: 3000,
      })
    }
  }, [lastMessage, toast])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Factory className="h-6 w-6" />
          <h1 className="text-lg font-semibold">IndustrialIoT</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Wifi className="mr-1 h-3 w-3" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Desconectado
              </Badge>
            )}
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            Planta Principal
            <ChevronDown className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img src="/placeholder-user.jpg" alt="Avatar" className="rounded-full" height="32" width="32" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link href="/" className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/monitoring"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Gauge className="h-4 w-4" />
              Monitoreo
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Análisis
            </Link>
            <Link
              href="/alerts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <AlertTriangle className="h-4 w-4" />
              Alertas
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Inventario
            </Link>
            <Link
              href="/automation"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Zap className="h-4 w-4" />
              Automatización
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Usuarios
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
            <Link
              href="/grok-ai"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              Grok-AI
            </Link>
            <Link
              href="/scada"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
                <line x1="9" y1="9" x2="9" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
              SCADA
            </Link>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
            <div className="ml-auto flex items-center gap-2">
              <ReportGenerator />
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Añadir Dispositivo
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Dispositivos Activos</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deviceStats.active}/{deviceStats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  {deviceStats.total - deviceStats.active} dispositivos desconectados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Temperatura Promedio</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deviceStats.temperature}</div>
                <p className="text-xs text-muted-foreground">{deviceStats.tempChange} desde ayer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Consumo Energético</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deviceStats.energy}</div>
                <p className="text-xs text-muted-foreground">{deviceStats.energyChange} comparado con ayer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deviceStats.alerts}</div>
                <p className="text-xs text-muted-foreground">{deviceStats.alertsDetail}</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="devices">Dispositivos</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DeviceMetrics />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Estado de Producción</CardTitle>
                    <CardDescription>Líneas de producción activas en tiempo real</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {["Línea A", "Línea B", "Línea C"].map((line, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${i === 2 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                          <span>{line}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {i === 0 ? "98%" : i === 1 ? "100%" : "85%"}
                          </span>
                          <Badge variant={i === 2 ? "outline" : "default"}>
                            {i === 0 ? "Normal" : i === 1 ? "Óptimo" : "Advertencia"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Mantenimiento</CardTitle>
                    <CardDescription>Próximas tareas programadas</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {[
                      { device: "Sensor T-103", date: "Hoy, 15:00", status: "Pendiente" },
                      { device: "Motor B-205", date: "Mañana, 09:30", status: "Programado" },
                      { device: "Compresor A-001", date: "15/05, 11:00", status: "Programado" },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-orange-500" : "bg-blue-500"}`}></div>
                        <div className="grid gap-0.5">
                          <p className="text-sm font-medium">{task.device}</p>
                          <p className="text-xs text-muted-foreground">{task.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      Ver Calendario Completo
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="devices">
              <DeviceTable />
            </TabsContent>
            <TabsContent value="alerts">
              <AlertsPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
