"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, CheckCircle, XCircle } from "lucide-react"

export default function QualityMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Calidad</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98.7%</div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            <span>1.2% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Objetivo</span>
              <span>99%</span>
            </div>
            <Progress value={(98.7 / 99) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Defectos</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.3%</div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span>0.5% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Objetivo</span>
              <span>1.0%</span>
            </div>
            <Progress value={(1.0 / 1.3) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Rechazos</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">163 unidades</div>
          <div className="flex items-center text-xs text-green-600">
            <ArrowDown className="mr-1 h-4 w-4" />
            <span>12% respecto al período anterior</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Del total</span>
              <span>1.3%</span>
            </div>
            <Progress value={1.3} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
