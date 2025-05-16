import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Add the missing export that's being referenced elsewhere in the codebase
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies })
}

export function createServerClient() {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}
