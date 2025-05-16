"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react"
import { format } from "date-fns"

interface RealTimeAlertsListProps {
  alerts: any[]
  compact?: boolean
}

export function RealTimeAlertsList({ alerts, compact = false }: RealTimeAlertsListProps) {
  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null)

  if (alerts.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 border rounded-md">
        <p className="text-muted-foreground">No alerts available</p>
      </div>
    )
  }

  // Function to update alert status
  const updateAlertStatus = async (alertId: string, status: string) => {
    try {
      setUpdatingAlertId(alertId)
      const { error } = await supabase
        .from("device_alerts")
        .update({
          status,
          ...(status === "RESOLVED" ? { resolved_at: new Date().toISOString() } : {}),
        })
        .eq("id", alertId)

      if (error) throw error
    } catch (err) {
      console.error("Error updating alert status:", err)
    } finally {
      setUpdatingAlertId(null)
    }
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <Badge variant="destructive" className="bg-red-600">
            Critical
          </Badge>
        )
      case "HIGH":
        return <Badge variant="destructive">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "LOW":
        return <Badge className="bg-blue-500">Low</Badge>
      case "INFO":
        return <Badge variant="outline">Info</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Active
          </Badge>
        )
      case "ACKNOWLEDGED":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Acknowledged
          </Badge>
        )
      case "RESOLVED":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Resolved
          </Badge>
        )
      case "IGNORED":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Ignored
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "ACKNOWLEDGED":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "RESOLVED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "IGNORED":
        return <Info className="h-5 w-5 text-gray-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="overflow-hidden">
          <CardContent className={compact ? "p-3" : "p-4"}>
            <div className="flex items-start gap-3">
              <div className="mt-1">{getStatusIcon(alert.status)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>{alert.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
                <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>{alert.message}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(alert.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </div>
                  {!compact && alert.status !== "RESOLVED" && alert.status !== "IGNORED" && (
                    <div className="flex gap-2">
                      {alert.status === "ACTIVE" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAlertStatus(alert.id, "ACKNOWLEDGED")}
                          disabled={updatingAlertId === alert.id}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateAlertStatus(alert.id, "RESOLVED")}
                        disabled={updatingAlertId === alert.id}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
