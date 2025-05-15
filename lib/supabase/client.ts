import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for browser-side usage
const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || ""

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
