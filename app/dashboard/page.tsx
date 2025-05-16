import { createServerSupabaseClient } from "@/lib/supabase/server"
import { RealTimeDashboard } from "@/components/dashboard/real-time-dashboard"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <p>Please log in to view the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <RealTimeDashboard userId={session.user.id} />
    </div>
  )
}
