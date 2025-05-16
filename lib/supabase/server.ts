import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a function to get the Supabase client for server components
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies })
}

// Add the missing export that's being referenced elsewhere in the codebase
export function createServerClient() {
  const cookieStore = cookies()

  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "", {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
