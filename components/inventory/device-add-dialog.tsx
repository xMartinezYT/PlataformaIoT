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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface DeviceAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeviceAddDialog({ open, onOpenChange }: DeviceAddDialogProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const handleAdd = () => {
    setIsAdding(true)

    // Simulación de añadir dispositivo
    setTimeout(() => {
      setIsAdding(false)
      onOpenChange(false)

      toast({
        title: "Dispositivo añadido",
        description: "El dispositivo ha sido añadido exitosamente al inventario.",
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Dispositivo</DialogTitle>
          <DialogDescription>Complete la información para añadir un nuevo dispositivo al inventario.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            <TabsTrigger value="location">Ubicación</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-id">ID del Dispositivo</Label>
              <Input id="device-id" placeholder="Ej: DEV-009" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-name">Nombre del Dispositivo</Label>
              <Input id="device-name" placeholder="Ej: Sensor de Temperatura A2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-type">Tipo de Dispositivo</Label>
              <Select>
                <SelectTrigger id="device-type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="camera">Cámara</SelectItem>
                  <SelectItem value="controller">Controlador</SelectItem>
                  <SelectItem value="actuator">Actuador</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-status">Estado</Label>
              <Select defaultValue="active">
                <SelectTrigger id="device-status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-model">Modelo</Label>
              <Input id="device-model" placeholder="Ej: TS-2000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-manufacturer">Fabricante</Label>
              <Input id="device-manufacturer" placeholder="Ej: TechSense" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-serial">Número de Serie</Label>
              <Input id="device-serial" placeholder="Ej: TS2000-12345" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-firmware">Versión de Firmware</Label>
              <Input id="device-firmware" placeholder="Ej: v2.3.1" />
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-location">Ubicación</Label>
              <Input id="device-location" placeholder="Ej: Área de Producción" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-area">Área</Label>
              <Select>
                <SelectTrigger id="device-area">
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Producción</SelectItem>
                  <SelectItem value="warehouse">Almacén</SelectItem>
                  <SelectItem value="office">Oficinas</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="device-latitude">Latitud</Label>
                <Input id="device-latitude" placeholder="Ej: 41.3851" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="device-longitude">Longitud</Label>
                <Input id="device-longitude" placeholder="Ej: 2.1734" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="device-installation-date">Fecha de Instalación</Label>
              <Input id="device-installation-date" type="date" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={isAdding}>
            {isAdding ? "Añadiendo..." : "Añadir Dispositivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
