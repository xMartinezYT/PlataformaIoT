"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, Target } from "lucide-react"

export default function ProductionKpis() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Producción Total</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,543 unidades</div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span>8.2% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Producción</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">523 unidades/hora</div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span>3.5% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tiempo de Ciclo</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">6.8 segundos</div>
          <div className="flex items-center text-xs text-red-600">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span>2.1% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
