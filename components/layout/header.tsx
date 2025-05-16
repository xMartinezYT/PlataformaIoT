"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { RealTimeNotificationBell } from "@/components/notifications/real-time-notification-bell"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">IoT Platform</span>
          </Link>
        </div>

        <nav
          className={`${isOpen ? "flex" : "hidden"} fixed inset-0 top-16 z-50 flex-col bg-background md:static md:flex md:flex-row md:items-center md:gap-6`}
        >
          <div className="container flex flex-col gap-4 py-4 md:container-none md:flex-row md:py-0">
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 md:hidden" onClick={closeMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/devices"
              className={`text-sm font-medium ${pathname.startsWith("/devices") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Devices
            </Link>
            <Link
              href="/alerts"
              className={`text-sm font-medium ${pathname.startsWith("/alerts") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={closeMenu}
            >
              Alerts
            </Link>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {user && <RealTimeNotificationBell userId={user.id} />}
          {user ? (
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
