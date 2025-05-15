"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Clock,
  TabletIcon as DeviceTablet,
  Layers,
  Loader2,
  Users,
  Activity,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartContainer } from "@/components/dashboard/chart-container"
import { DeviceStatusChart } from "@/components/dashboard/device-status-chart"
import { AlertSeverityChart } from "@/components/dashboard/alert-severity-chart"
import { ReadingsChart } from "@/components/dashboard/readings-chart"
import { ActivityItem } from "@/components/dashboard/activity-item"
import { MaintenanceList } from "@/components/dashboard/maintenance-list"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")

        if (!response.ok) {
          throw new Error("Error al cargar los datos del dashboard")
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("No se pudieron cargar los datos del dashboard. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando datos del dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  // Preparar datos para los gráficos
  const deviceStatusData =
    dashboardData?.deviceStatusCounts.map((item: any) => ({
      status: item.status,
      count: item._count.id,
    })) || []

  const alertSeverityData =
    dashboardData?.alertSeverityCounts.map((item: any) => ({
      severity: item.severity,
      count: item._count.id,
    })) || []

  // Calcular dispositivos online y offline
  const onlineDevices = deviceStatusData.find((item: any) => item.status === "ONLINE")?.count || 0
  const offlineDevices = deviceStatusData.find((item: any) => item.status === "OFFLINE")?.count || 0
  const maintenanceDevices = deviceStatusData.find((item: any) => item.status === "MAINTENANCE")?.count || 0
  const errorDevices = deviceStatusData.find((item: any) => item.status === "ERROR")?.count || 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dispositivos Totales"
          value={dashboardData?.totalDevices || 0}
          icon={<DeviceTablet />}
          color="blue"
        />
        <StatCard
          title="Alertas Activas"
          value={dashboardData?.totalAlerts || 0}
          icon={<AlertTriangle />}
          trend={{
            value: dashboardData?.alertTrend || 0,
            isPositive: dashboardData?.alertTrend < 0,
          }}
          color="red"
        />
        <StatCard title="Categorías" value={dashboardData?.totalCategories || 0} icon={<Layers />} color="purple" />
        <StatCard title="Usuarios" value={dashboardData?.totalUsers || 0} icon={<Users />} color="green" />
      </div>

      {/* Estado de dispositivos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dispositivos en línea"
          value={onlineDevices}
          icon={<Wifi className="text-green-500" />}
          color="green"
          trend={{
            value: dashboardData?.deviceOnlineTrend || 0,
            isPositive: dashboardData?.deviceOnlineTrend > 0,
          }}
        />
        <StatCard
          title="Dispositivos desconectados"
          value={offlineDevices}
          icon={<WifiOff className="text-gray-500" />}
          color="gray"
        />
        <StatCard
          title="En mantenimiento"
          value={maintenanceDevices}
          icon={<Clock className="text-yellow-500" />}
          color="yellow"
        />
        <StatCard
          title="Con errores"
          value={errorDevices}
          icon={<AlertTriangle className="text-red-500" />}
          color="red"
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de estado de dispositivos */}
        <ChartContainer title="Estado de Dispositivos" description="Distribución de dispositivos por estado">
          <DeviceStatusChart data={deviceStatusData} />
        </ChartContainer>

        {/* Gráfico de severidad de alertas */}
        <ChartContainer title="Alertas por Severidad" description="Distribución de alertas activas por severidad">
          <AlertSeverityChart data={alertSeverityData} />
        </ChartContainer>

        {/* Gráfico de lecturas de dispositivos */}
        <ChartContainer title="Lecturas de Dispositivos" description="Datos de sensores de las últimas 24 horas">
          <ReadingsChart data={dashboardData?.readingsData || []} />
        </ChartContainer>

        {/* Actividades recientes */}
        <ChartContainer title="Actividades Recientes" description="Últimas acciones realizadas en la plataforma">
          <div className="max-h-64 overflow-y-auto">
            {dashboardData?.recentActivities?.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {dashboardData.recentActivities.map((activity: any) => (
                  <ActivityItem
                    key={activity.id}
                    user={activity.user}
                    action={activity.action}
                    details={activity.details}
                    timestamp={activity.timestamp}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center py-8">
                <p className="text-gray-500">No hay actividades recientes</p>
              </div>
            )}
          </div>
        </ChartContainer>
      </div>

      {/* Sección inferior */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Próximos mantenimientos */}
        <ChartContainer title="Próximos Mantenimientos" description="Mantenimientos programados para los dispositivos">
          <MaintenanceList maintenances={dashboardData?.upcomingMaintenance || []} />
        </ChartContainer>

        {/* Dispositivos con más alertas */}
        <ChartContainer title="Dispositivos con más Alertas" description="Dispositivos que requieren atención">
          {dashboardData?.devicesWithMostAlerts?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.devicesWithMostAlerts.map((device: any) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center">
                    <Cpu className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{device.name}</p>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">ID: {device.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      {device._count.alerts} alertas
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <Activity className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-8">
              <p className="text-gray-500">No hay dispositivos con alertas</p>
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
