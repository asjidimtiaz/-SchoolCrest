"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function updateCalendarUrl(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string
    const calendar_url = formData.get("calendar_url") as string
    const google_api_key = formData.get("google_api_key") as string

    const { error } = await supabaseAdmin
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
