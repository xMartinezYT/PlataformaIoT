"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient()
        const { data } = await supabase.auth.getSession()

        if (data?.session?.user) {
          setUser(data.session.user)
        } else {
          // Redirect to login if no session
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Redirect to login on error
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <button
        onClick={async () => {
          const supabase = createClientComponentClient()
          await supabase.auth.signOut()
          window.location.href = "/login"
        }}
        className="mt-4 px-4 py-2 bg-gray-200 rounded"
      >
        Sign Out
      </button>
    </div>
  )
}
