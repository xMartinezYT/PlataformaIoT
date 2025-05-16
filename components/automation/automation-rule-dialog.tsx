"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface AutomationRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AutomationRuleDialog({ open, onOpenChange }: AutomationRuleDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreate = () => {
    setIsCreating(true)

    // Simulación de creación de regla
    setTimeout(() => {
      setIsCreating(false)
      onOpenChange(false)

      toast({
        title: "Regla creada",
        description: "La regla de automatización ha sido creada exitosamente.",
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Regla de Automatización</DialogTitle>
          <DialogDescription>Configure los parámetros para la nueva regla de automatización.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="trigger">Disparador</TabsTrigger>
            <TabsTrigger value="action">Acción</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Regla</Label>
              <Input id="name" placeholder="Ej: Alerta de temperatura alta" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa el propósito de esta regla de automatización"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="trigger" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="trigger-type">Tipo de Disparador</Label>
              <Select defaultValue="threshold">
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Seleccionar tipo de disparador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="threshold">Umbral de valor</SelectItem>
                  <SelectItem value="status">Cambio de estado</SelectItem>
                  <SelectItem value="schedule">Programado</SelectItem>
                  <SelectItem value="event">Evento específico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="device-type">Tipo de Dispositivo</Label>
              <Select defaultValue="sensor">
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Seleccionar tipo de dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="camera">Cámara</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition">Condición</Label>
              <div className="flex gap-2">
                <Select defaultValue="temperature">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Parámetro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperatura</SelectItem>
                    <SelectItem value="humidity">Humedad</SelectItem>
                    <SelectItem value="pressure">Presión</SelectItem>
                    <SelectItem value="battery">Batería</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="greater">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater">Mayor que</SelectItem>
                    <SelectItem value="less">Menor que</SelectItem>
                    <SelectItem value="equal">Igual a</SelectItem>
                    <SelectItem value="not-equal">Diferente de</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="number" placeholder="Valor" className="w-[120px]" defaultValue="80" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="action" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="action-type">Tipo de Acción</Label>
              <Select defaultValue="notification">
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="Seleccionar tipo de acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">Enviar notificación</SelectItem>
                  <SelectItem value="control">Control de dispositivo</SelectItem>
                  <SelectItem value="report">Generar reporte</SelectItem>
                  <SelectItem value="maintenance">Programar mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notification-channels">Canales de Notificación</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" size="sm">
                  Email
                </Button>
                <Button variant="outline" className="rounded-full" size="sm">
                  SMS
                </Button>
                <Button variant="outline" className="rounded-full bg-primary text-primary-foreground" size="sm">
                  Push
                </Button>
                <Button variant="outline" className="rounded-full" size="sm">
                  Slack
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="Mensaje de la notificación"
                className="min-h-[80px]"
                defaultValue="¡Alerta! La temperatura ha superado el umbral establecido de 80°C."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipients">Destinatarios</Label>
              <Input
                id="recipients"
                placeholder="Correos electrónicos separados por comas"
                defaultValue="admin@industrial-iot.com, soporte@industrial-iot.com"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creando..." : "Crear Regla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
