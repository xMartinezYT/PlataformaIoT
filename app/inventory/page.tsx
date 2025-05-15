"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Download, Filter, Package, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeviceInventoryTable from "@/components/inventory/device-inventory-table"
import DeviceCategories from "@/components/inventory/device-categories"
import InventoryStats from "@/components/inventory/inventory-stats"
import DeviceAddDialog from "@/components/inventory/device-add-dialog"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

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
          <span className="text-foreground">Inventario</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Dispositivo
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Inventario de Dispositivos</h1>
            <p className="text-muted-foreground">Gestione el inventario de dispositivos IoT</p>
          </div>
        </div>

        <InventoryStats />

        <Tabs defaultValue="all" className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="inactive">Inactivos</TabsTrigger>
              <TabsTrigger value="maintenance">En Mantenimiento</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar dispositivos..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="sensor">Sensores</SelectItem>
                    <SelectItem value="motor">Motores</SelectItem>
                    <SelectItem value="camera">Cámaras</SelectItem>
                    <SelectItem value="controller">Controladores</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Categorías</CardTitle>
                  <CardDescription>Dispositivos por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <DeviceCategories />
                </CardContent>
              </Card>
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Listado de Dispositivos</CardTitle>
                  <CardDescription>Inventario completo de dispositivos IoT</CardDescription>
                </CardHeader>
                <CardContent>
                  <DeviceInventoryTable searchTerm={searchTerm} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Activos</CardTitle>
                <CardDescription>Dispositivos actualmente en funcionamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceInventoryTable searchTerm={searchTerm} statusFilter="active" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Inactivos</CardTitle>
                <CardDescription>Dispositivos fuera de servicio o desconectados</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceInventoryTable searchTerm={searchTerm} statusFilter="inactive" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos en Mantenimiento</CardTitle>
                <CardDescription>Dispositivos actualmente en mantenimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceInventoryTable searchTerm={searchTerm} statusFilter="maintenance" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <DeviceAddDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
