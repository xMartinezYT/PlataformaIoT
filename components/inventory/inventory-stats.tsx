"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, Package, Settings, ShieldAlert, Truck } from "lucide-react"

export default function InventoryStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Dispositivos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">65</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              5%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Dispositivos Activos</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">52</div>
          <p className="text-xs text-muted-foreground">80% del total de dispositivos</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Requieren Mantenimiento</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Dispositivos Nuevos</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />3
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
