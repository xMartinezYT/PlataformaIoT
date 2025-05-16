import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { DeviceControlPanel } from "@/components/devices/device-control-panel"
import { RealTimeDeviceDetail } from "@/components/devices/real-time-device-detail"
import { RealTimeReadingsChart } from "@/components/devices/real-time-readings-chart"
import { RealTimeAlertsList } from "@/components/devices/real-time-alerts-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch device details
  const { data: device, error } = await supabase.from("devices").select("*").eq("id", params.id).single()

  if (error || !device) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">{device.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RealTimeDeviceDetail deviceId={params.id} initialData={device} />
        </div>

        <div>
          <DeviceControlPanel
            deviceId={params.id}
            deviceName={device.name}
            deviceStatus={device.status}
            deviceType={device.type}
          />
        </div>
      </div>

      <Tabs defaultValue="readings" className="w-full">
        <TabsList>
          <TabsTrigger value="readings">Readings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="readings" className="pt-4">
          <RealTimeReadingsChart deviceId={params.id} />
        </TabsContent>

        <TabsContent value="alerts" className="pt-4">
          <RealTimeAlertsList deviceId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
