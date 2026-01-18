"use server"

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

async function getSupabase() {
  const cookieStore = await cookies()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing")
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle edge case
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Handle edge case
          }
        },
      },
    }
  )
}

export async function updateCalendarUrl(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase()
    const id = formData.get("id") as string
    const calendar_url = formData.get("calendar_url") as string
    const google_api_key = formData.get("google_api_key") as string

    const { error } = await supabase
      .from("schools")
      .update({ 
        calendar_url,
        google_api_key
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating calendar URL:", error.message)
      return { error: error.message }
    }

    revalidatePath("/admin/school-calendar")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("FATAL in updateCalendarUrl:", err)
    return { error: "An unexpected error occurred while updating the calendar URL." }
  }
}
