"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Plus, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const users = [
  {
    id: "USR-001",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@industrial-iot.com",
    role: "admin",
    department: "IT",
    lastLogin: "Hace 10 minutos",
    status: "active",
  },
  {
    id: "USR-002",
    name: "María López",
    email: "maria.lopez@industrial-iot.com",
    role: "manager",
    department: "Producción",
    lastLogin: "Hace 2 horas",
    status: "active",
  },
  {
    id: "USR-003",
    name: "Juan Martínez",
    email: "juan.martinez@industrial-iot.com",
    role: "technician",
    department: "Mantenimiento",
    lastLogin: "Hace 1 día",
    status: "active",
  },
  {
    id: "USR-004",
    name: "Ana García",
    email: "ana.garcia@industrial-iot.com",
    role: "viewer",
    department: "Calidad",
    lastLogin: "Hace 3 días",
    status: "inactive",
  },
  {
    id: "USR-005",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@industrial-iot.com",
    role: "manager",
    department: "Logística",
    lastLogin: "Hace 5 horas",
    status: "active",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <span className="text-foreground">Usuarios</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre los usuarios y roles del sistema</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">5 roles diferentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Acceso completo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Último inicio: hace 10 min</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Sin actividad &gt; 30 días</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuarios</CardTitle>
                <CardDescription>Gestione los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar usuarios..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead className="w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : user.role === "manager"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : user.role === "technician"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                              }
                            >
                              {user.role === "admin"
                                ? "Administrador"
                                : user.role === "manager"
                                  ? "Gestor"
                                  : user.role === "technician"
                                    ? "Técnico"
                                    : "Visualizador"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {user.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Acciones
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                                <DropdownMenuItem>Ver actividad</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Roles del Sistema</CardTitle>
                <CardDescription>Gestione los roles y sus permisos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      name: "Administrador",
                      description: "Acceso completo al sistema",
                      users: 3,
                      color: "purple",
                    },
                    {
                      name: "Gestor",
                      description: "Gestión de dispositivos y alertas",
                      users: 5,
                      color: "blue",
                    },
                    {
                      name: "Técnico",
                      description: "Mantenimiento y monitoreo",
                      users: 4,
                      color: "green",
                    },
                    {
                      name: "Visualizador",
                      description: "Solo lectura",
                      users: 3,
                      color: "gray",
                    },
                  ].map((role, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{role.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className={`bg-${role.color}-50 text-${role.color}-700 border-${role.color}-200`}
                          >
                            {role.users} usuarios
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Permisos</CardTitle>
                <CardDescription>Configure los permisos para cada rol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permiso</TableHead>
                        <TableHead>Administrador</TableHead>
                        <TableHead>Gestor</TableHead>
                        <TableHead>Técnico</TableHead>
                        <TableHead>Visualizador</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Ver dashboard", admin: true, manager: true, technician: true, viewer: true },
                        { name: "Ver dispositivos", admin: true, manager: true, technician: true, viewer: true },
                        { name: "Añadir dispositivos", admin: true, manager: true, technician: false, viewer: false },
                        { name: "Editar dispositivos", admin: true, manager: true, technician: true, viewer: false },
                        {
                          name: "Eliminar dispositivos",
                          admin: true,
                          manager: false,
                          technician: false,
                          viewer: false,
                        },
                        { name: "Ver alertas", admin: true, manager: true, technician: true, viewer: true },
                        { name: "Gestionar alertas", admin: true, manager: true, technician: true, viewer: false },
                        {
                          name: "Configuración del sistema",
                          admin: true,
                          manager: false,
                          technician: false,
                          viewer: false,
                        },
                        { name: "Gestión de usuarios", admin: true, manager: false, technician: false, viewer: false },
                      ].map((permission, i) => (
                        <TableRow key={i}>
                          <TableCell>{permission.name}</TableCell>
                          <TableCell>{permission.admin ? "✓" : "✗"}</TableCell>
                          <TableCell>{permission.manager ? "✓" : "✗"}</TableCell>
                          <TableCell>{permission.technician ? "✓" : "✗"}</TableCell>
                          <TableCell>{permission.viewer ? "✓" : "✗"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Actividad</CardTitle>
                <CardDescription>Historial de actividad de los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "Carlos Rodríguez",
                      action: "Inició sesión",
                      timestamp: "Hace 10 minutos",
                      ip: "192.168.1.45",
                    },
                    {
                      user: "María López",
                      action: "Modificó configuración de dispositivo MOT-103",
                      timestamp: "Hace 2 horas",
                      ip: "192.168.1.62",
                    },
                    {
                      user: "Carlos Rodríguez",
                      action: "Añadió nuevo dispositivo SEN-009",
                      timestamp: "Hace 3 horas",
                      ip: "192.168.1.45",
                    },
                    {
                      user: "Juan Martínez",
                      action: "Confirmó alerta ALT-002",
                      timestamp: "Hace 5 horas",
                      ip: "192.168.1.78",
                    },
                    {
                      user: "Ana García",
                      action: "Inició sesión",
                      timestamp: "Hace 1 día",
                      ip: "192.168.1.90",
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex-1">
                        <div className="font-medium">{activity.user}</div>
                        <div className="text-sm text-muted-foreground">{activity.action}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>{activity.timestamp}</div>
                        <div className="text-muted-foreground">IP: {activity.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
