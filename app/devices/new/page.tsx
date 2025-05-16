import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCategories } from "@/lib/services/category-service"
import { DeviceForm } from "@/components/devices/device-form"

export const dynamic = "force-dynamic"

export default async function NewDevicePage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <p>Please log in to create a device.</p>
      </div>
    )
  }

  const categories = await getCategories()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Device</h1>
      <DeviceForm categories={categories} userId={session.user.id} />
    </div>
  )
}
