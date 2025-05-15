"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const categories = [
  {
    name: "Sensores",
    count: 24,
    total: 30,
    color: "bg-blue-500",
  },
  {
    name: "Motores",
    count: 12,
    total: 15,
    color: "bg-green-500",
  },
  {
    name: "Cámaras",
    count: 8,
    total: 10,
    color: "bg-yellow-500",
  },
  {
    name: "Controladores",
    count: 6,
    total: 8,
    color: "bg-purple-500",
  },
  {
    name: "Actuadores",
    count: 10,
    total: 12,
    color: "bg-orange-500",
  },
  {
    name: "Otros",
    count: 5,
    total: 5,
    color: "bg-gray-500",
  },
]

export default function DeviceCategories() {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${category.color}`}></div>
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <Badge variant="outline" className="font-mono">
              {category.count}/{category.total}
            </Badge>
          </div>
          <Progress value={(category.count / category.total) * 100} className="h-2" />
        </div>
      ))}
    </div>
  )
}
