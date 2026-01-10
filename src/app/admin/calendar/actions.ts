'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing in calendar/actions.ts");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle edge case
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle edge case
          }
        },
      },
    }
  )
}

export async function deleteEvent(id: string) {
  try {
    const supabase = await getSupabase()
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      console.error("Error in deleteEvent:", error.message)
      throw new Error(error.message)
    }
    revalidatePath('/admin/calendar')
  } catch (err) {
    console.error("FATAL in deleteEvent:", err)
    throw err;
  }
}

export async function upsertEvent(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase()
    
    const id = formData.get('id') as string | null
    const school_id = formData.get('school_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const start_time = formData.get('start_time') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string

    const payload = {
      school_id, title, description, start_time, location, category
    }

    let result;
    if (id) {
      result = await supabase.from('events').update(payload).eq('id', id)
    } else {
      result = await supabase.from('events').insert(payload)
    }

    if (result.error) {
      console.error("Error in upsertEvent:", result.error.message)
      return { error: result.error.message }
    }
    revalidatePath('/admin/calendar')
    return { success: true }
  } catch (err) {
    console.error("FATAL in upsertEvent:", err)
    return { error: "An unexpected error occurred while saving the event." }
  }
}

