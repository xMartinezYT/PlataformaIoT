import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getDevices } from "@/lib/services/device-service"
import { DeviceList } from "@/components/devices/device-list"

export const dynamic = "force-dynamic"

export default async function DevicesPage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <p>Please log in to view your devices.</p>
      </div>
    )
  }

  const devices = await getDevices(session.user.id)

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading devices...</div>}>
        <DeviceList devices={devices} />
      </Suspense>
    </div>
  )
}
