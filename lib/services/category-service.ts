import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

export type Category = Database["public"]["Tables"]["categories"]["Row"]

export async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }

  return data
}

export async function getCategoryById(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching category:", error)
    throw new Error("Failed to fetch category")
  }

  return data
}
