"use client"

import { useState } from "react"
import type { DeviceAlert } from "@/lib/services/device-service"
import { AlertCard } from "@/components/alerts/alert-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AlertListProps {
  alerts: DeviceAlert[]
  compact?: boolean
}

export function AlertList({ alerts, compact = false }: AlertListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  // Filter alerts based on search term and severity filter
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter

    return matchesSearch && matchesSeverity
  })

  if (compact) {
    return (
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No hay alertas activas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Buscar por título, mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity-filter">Severidad</Label>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger id="severity-filter">
              <SelectValue placeholder="Filtrar por severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="CRITICAL">Crítica</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="INFO">Informativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alert list */}
      {filteredAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No se encontraron alertas</p>
          <p className="text-sm text-muted-foreground">
            {alerts.length === 0
              ? "No hay alertas activas en este momento."
              : "No hay alertas que coincidan con los filtros aplicados."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  )
}
