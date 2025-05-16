"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error.message)
          return
        }

        setSession(data.session)
        setUser(data.session?.user || null)
      } catch (error) {
        console.error("Unexpected error during getSession:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event)
      setSession(newSession)
      setUser(newSession?.user || null)

      // Force refresh on auth changes
      router.refresh()
    })

    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      setSession(data.session)
      setUser(data.user)
      return { error: null }
    } catch (error) {
      console.error("Unexpected error during signIn:", error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
