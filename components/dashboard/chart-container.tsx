import type React from "react"

interface ChartContainerProps {
  title: string
  children: React.ReactNode
  description?: string
  action?: React.ReactNode
}

export function ChartContainer({ title, children, description, action }: ChartContainerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="h-full">{children}</div>
    </div>
  )
}
