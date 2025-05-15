"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "00:00",
    Producción: 120,
    Iluminación: 30,
    Climatización: 45,
    Otros: 25,
  },
  {
    name: "03:00",
    Producción: 100,
    Iluminación: 25,
    Climatización: 40,
    Otros: 20,
  },
  {
    name: "06:00",
    Producción: 140,
    Iluminación: 40,
    Climatización: 50,
    Otros: 30,
  },
  {
    name: "09:00",
    Producción: 180,
    Iluminación: 45,
    Climatización: 60,
    Otros: 35,
  },
  {
    name: "12:00",
    Producción: 200,
    Iluminación: 50,
    Climatización: 70,
    Otros: 40,
  },
  {
    name: "15:00",
    Producción: 190,
    Iluminación: 50,
    Climatización: 65,
    Otros: 40,
  },
  {
    name: "18:00",
    Producción: 160,
    Iluminación: 45,
    Climatización: 55,
    Otros: 35,
  },
  {
    name: "21:00",
    Producción: 130,
    Iluminación: 35,
    Climatización: 50,
    Otros: 30,
  },
]

export default function EnergyConsumptionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value} kWh`} />
        <Legend />
        <Area type="monotone" dataKey="Producción" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="Iluminación" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="Climatización" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="Otros" stackId="1" stroke="#ff8042" fill="#ff8042" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
