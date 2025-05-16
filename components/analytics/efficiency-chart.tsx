"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Lun",
    "Línea A": 85,
    "Línea B": 78,
    "Línea C": 92,
  },
  {
    name: "Mar",
    "Línea A": 88,
    "Línea B": 82,
    "Línea C": 91,
  },
  {
    name: "Mié",
    "Línea A": 82,
    "Línea B": 85,
    "Línea C": 88,
  },
  {
    name: "Jue",
    "Línea A": 75,
    "Línea B": 78,
    "Línea C": 84,
  },
  {
    name: "Vie",
    "Línea A": 92,
    "Línea B": 87,
    "Línea C": 94,
  },
  {
    name: "Sáb",
    "Línea A": 65,
    "Línea B": 60,
    "Línea C": 70,
  },
  {
    name: "Dom",
    "Línea A": 60,
    "Línea B": 55,
    "Línea C": 65,
  },
]

export default function EfficiencyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar dataKey="Línea A" fill="#8884d8" />
        <Bar dataKey="Línea B" fill="#82ca9d" />
        <Bar dataKey="Línea C" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}
