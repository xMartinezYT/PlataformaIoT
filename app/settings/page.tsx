"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Save, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente.",
      })
    }, 1500)
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
          <span className="text-foreground">Configuración</span>
        </div>
        <div className="ml-auto">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <SettingsIcon className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">Administre la configuración de la plataforma</p>
          </div>
        </div>

        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 justify-start">
                <TabsTrigger
                  value="general"
                  className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full"
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="devices"
                  className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full"
                >
                  Dispositivos
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full"
                >
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="users" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full">
                  Usuarios y Roles
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full"
                >
                  Integraciones
                </TabsTrigger>
                <TabsTrigger value="api" className="justify-start px-4 py-2 h-10 data-[state=active]:bg-muted w-full">
                  API
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="general" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                    <CardDescription>Configuración básica de la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nombre de la Empresa</Label>
                      <Input id="company-name" defaultValue="Industrial Solutions S.A." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Nombre del Sitio</Label>
                      <Input id="site-name" defaultValue="Planta Principal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select defaultValue="America/Mexico_City">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Seleccionar zona horaria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                          <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select defaultValue="es">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Modo Oscuro</Label>
                        <p className="text-sm text-muted-foreground">Activar el modo oscuro en la interfaz</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Dispositivos</CardTitle>
                    <CardDescription>Administre la configuración de los dispositivos IoT</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Intervalo de Actualización (segundos)</Label>
                      <Input id="refresh-interval" type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Retención de Datos</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="data-retention">
                          <SelectValue placeholder="Seleccionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                          <SelectItem value="180">6 meses</SelectItem>
                          <SelectItem value="365">1 año</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-discovery">Descubrimiento Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que la plataforma descubra nuevos dispositivos automáticamente
                        </p>
                      </div>
                      <Switch id="auto-discovery" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-update">Actualización Automática de Firmware</Label>
                        <p className="text-sm text-muted-foreground">
                          Actualizar automáticamente el firmware de los dispositivos
                        </p>
                      </div>
                      <Switch id="auto-update" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="default-protocol">Protocolo Predeterminado</Label>
                      <Select defaultValue="mqtt">
                        <SelectTrigger id="default-protocol">
                          <SelectValue placeholder="Seleccionar protocolo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mqtt">MQTT</SelectItem>
                          <SelectItem value="http">HTTP/REST</SelectItem>
                          <SelectItem value="coap">CoAP</SelectItem>
                          <SelectItem value="modbus">Modbus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>Administre cómo se envían las notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">Recibir alertas por correo electrónico</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">Notificaciones por SMS</Label>
                        <p className="text-sm text-muted-foreground">Recibir alertas por mensaje de texto</p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Notificaciones Push</Label>
                        <p className="text-sm text-muted-foreground">Recibir alertas en el navegador o aplicación</p>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="notification-level">Nivel de Notificación</Label>
                      <Select defaultValue="warning">
                        <SelectTrigger id="notification-level">
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los eventos</SelectItem>
                          <SelectItem value="warning">Advertencias y críticos</SelectItem>
                          <SelectItem value="critical">Solo críticos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-recipients">Destinatarios de Email</Label>
                      <Textarea
                        id="email-recipients"
                        placeholder="Ingrese direcciones de correo separadas por comas"
                        defaultValue="admin@industrial-iot.com, soporte@industrial-iot.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuarios y Roles</CardTitle>
                    <CardDescription>Configuración de usuarios y permisos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                      <Input id="session-timeout" type="number" defaultValue="60" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Autenticación de Dos Factores</Label>
                        <p className="text-sm text-muted-foreground">Requerir 2FA para todos los usuarios</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="password-policy">Política de Contraseñas Estricta</Label>
                        <p className="text-sm text-muted-foreground">
                          Requerir contraseñas complejas (mínimo 8 caracteres, mayúsculas, números y símbolos)
                        </p>
                      </div>
                      <Switch id="password-policy" defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="default-role">Rol Predeterminado</Label>
                      <Select defaultValue="viewer">
                        <SelectTrigger id="default-role">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="manager">Gestor</SelectItem>
                          <SelectItem value="technician">Técnico</SelectItem>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Integraciones</CardTitle>
                    <CardDescription>Conecte la plataforma con sistemas externos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="erp-integration">Integración con ERP</Label>
                        <p className="text-sm text-muted-foreground">Conectar con el sistema ERP de la empresa</p>
                      </div>
                      <Switch id="erp-integration" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="erp-url">URL del ERP</Label>
                      <Input id="erp-url" defaultValue="https://erp.empresa.com/api" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="erp-key">Clave API</Label>
                      <Input id="erp-key" type="password" defaultValue="api_key_12345" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="scada-integration">Integración con SCADA</Label>
                        <p className="text-sm text-muted-foreground">Conectar con el sistema SCADA</p>
                      </div>
                      <Switch id="scada-integration" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scada-url">URL del SCADA</Label>
                      <Input id="scada-url" defaultValue="https://scada.empresa.com/api" disabled />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weather-integration">Datos Meteorológicos</Label>
                        <p className="text-sm text-muted-foreground">Integrar datos meteorológicos para análisis</p>
                      </div>
                      <Switch id="weather-integration" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de API</CardTitle>
                    <CardDescription>Administre el acceso a la API de la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="api-enabled">API Habilitada</Label>
                        <p className="text-sm text-muted-foreground">Permitir acceso a la API</p>
                      </div>
                      <Switch id="api-enabled" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Clave API</Label>
                      <div className="flex gap-2">
                        <Input id="api-key" defaultValue="sk_live_51NXxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                        <Button variant="outline" size="sm">
                          Regenerar
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Límite de Tasa (peticiones/minuto)</Label>
                      <Input id="rate-limit" type="number" defaultValue="100" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cors-enabled">CORS Habilitado</Label>
                        <p className="text-sm text-muted-foreground">Permitir solicitudes de origen cruzado</p>
                      </div>
                      <Switch id="cors-enabled" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowed-origins">Orígenes Permitidos</Label>
                      <Textarea
                        id="allowed-origins"
                        placeholder="Ingrese dominios separados por comas"
                        defaultValue="https://app.empresa.com, https://admin.empresa.com"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      Probar Conexión API
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
