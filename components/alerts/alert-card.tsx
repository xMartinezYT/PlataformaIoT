"use client"

import { useState } from "react"
import type { DeviceAlert } from "@/lib/services/device-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, AlertCircle, Info } from "lucide-react"
import { deviceService } from "@/lib/services/device-service"

interface AlertCardProps {
  alert: DeviceAlert
  compact?: boolean
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<DeviceAlert>(alert)

  // Get severity badge
  const getSeverityBadge = () => {
    switch (currentAlert.severity) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Crítica
          </Badge>
        )
      case "HIGH":
        return (
          <Badge className="bg-orange-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Alta
          </Badge>
        )
      case "MEDIUM":
        return (
          <Badge className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" /> Media
          </Badge>
        )
      case "LOW":
        return (
          <Badge className="bg-blue-500">
            <Info className="h-3 w-3 mr-1" /> Baja
          </Badge>
        )
      case "INFO":
        return (
          <Badge className="bg-green-500">
            <Info className="h-3 w-3 mr-1" /> Info
          </Badge>
        )
      default:
        return <Badge>{currentAlert.severity}</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (currentAlert.status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Activa
          </Badge>
        )
      case "ACKNOWLEDGED":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Reconocida
          </Badge>
        )
      case "RESOLVED":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Resuelta
          </Badge>
        )
      case "IGNORED":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Ignorada
          </Badge>
        )
      default:
        return <Badge variant="outline">{currentAlert.status}</Badge>
    }
  }

  // Update alert status
  const updateAlertStatus = async (status: string) => {
    setIsUpdating(true)
    try {
      const updatedAlert = await deviceService.updateAlert(currentAlert.id, {
        status: status as any,
        ...(status === "RESOLVED" ? { resolved_at: new Date().toISOString() } : {}),
      })
      setCurrentAlert(updatedAlert)
    } catch (error) {
      console.error("Error updating alert status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center space-x-3">
          <div>{getSeverityBadge()}</div>
          <div>
            <p className="font-medium">{currentAlert.title}</p>
            <p className="text-xs text-muted-foreground">{new Date(currentAlert.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{currentAlert.title}</CardTitle>
          <div className="flex space-x-2">
            {getSeverityBadge()}
            {getStatusBadge()}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{new Date(currentAlert.timestamp).toLocaleString()}</p>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm">{currentAlert.message}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ID de Alerta</span>
            <span className="font-mono text-xs">{currentAlert.id.substring(0, 8)}...</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ID de Dispositivo</span>
            <span className="font-mono text-xs">{currentAlert.device_id.substring(0, 8)}...</span>
          </div>
          {currentAlert.resolved_at && (
            <div className="flex flex-col col-span-2">
              <span className="text-xs text-muted-foreground">Resuelta el</span>
              <span>{new Date(currentAlert.resolved_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex space-x-2 w-full justify-end">
          {currentAlert.status === "ACTIVE" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateAlertStatus("ACKNOWLEDGED")}
                disabled={isUpdating}
              >
                <Clock className="h-4 w-4 mr-1" />
                Reconocer
              </Button>
              <Button variant="default" size="sm" onClick={() => updateAlertStatus("RESOLVED")} disabled={isUpdating}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolver
              </Button>
            </>
          )}

          {currentAlert.status === "ACKNOWLEDGED" && (
            <Button variant="default" size="sm" onClick={() => updateAlertStatus("RESOLVED")} disabled={isUpdating}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolver
            </Button>
          )}

          {(currentAlert.status === "RESOLVED" || currentAlert.status === "IGNORED") && (
            <Button variant="outline" size="sm" onClick={() => updateAlertStatus("ACTIVE")} disabled={isUpdating}>
              <AlertTriangle className="h-4 w-4 mr-1" />
              Reactivar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
