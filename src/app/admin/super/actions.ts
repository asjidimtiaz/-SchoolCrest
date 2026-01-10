'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getSupabase() {
  const cookieStore = await cookies()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing in super/actions.ts");
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

export async function createSchool(prevState: any, formData: FormData) {
  try {
    // Use service role key to bypass RLS
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: "Server configuration error: Missing Supabase credentials" }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const is_demo = formData.get('is_demo') === 'true'

    const { data: school, error } = await supabase.from('schools').insert({
      name,
      slug,
      is_demo,
      active: true,
      primary_color: '#000000',
      secondary_color: '#ffffff',
      accent_color: '#3b82f6'
    }).select().single()

    if (error) {
      console.error("Error in createSchool:", error.message)
      return { error: error.message }
    }

    
    revalidatePath('/admin/super')
    return { success: true, schoolId: school.id }
  } catch (err) {
    console.error("FATAL in createSchool:", err)
    return { error: "An unexpected error occurred while creating the school." }
  }
}

export async function assignAdmin(schoolId: string, userId: string) {
  try {
    const supabase = await getSupabase()
    
    const { error } = await supabase.from('admins').upsert({
      id: userId,
      school_id: schoolId,
      role: 'school_admin'
    })

    if (error) {
      console.error("Error in assignAdmin:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    return { success: true }
  } catch (err) {
    console.error("FATAL in assignAdmin:", err)
    return { error: "An unexpected error occurred while assigning the admin." }
  }
}

export async function toggleSchoolStatus(schoolId: string, newStatus: boolean) {
  try {
    const supabase = await getSupabase()
    
    const { error } = await supabase.from('schools')
      .update({ active: newStatus, last_updated: new Date().toISOString() })
      .eq('id', schoolId)

    if (error) {
      console.error("Error in toggleSchoolStatus:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    revalidatePath(`/admin/super/schools/${schoolId}`)
    return { success: true }
  } catch (err) {
    console.error("FATAL in toggleSchoolStatus:", err)
    return { error: "An unexpected error occurred while toggling school status." }
  }
}

export async function deleteSchool(schoolId: string) {
  try {
    // We need service role to delete everything associated
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: "Server configuration error: Missing Supabase credentials" }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Deleting a school typically needs cascaded deletes in DB, 
    // but just in case, we'll delete the school record itself.
    const { error } = await supabase.from('schools').delete().eq('id', schoolId)

    if (error) {
      console.error("Error in deleteSchool:", error.message)
      return { error: error.message }
    }
    
    revalidatePath('/admin/super')
    redirect('/admin/super')
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err
    console.error("FATAL in deleteSchool:", err)
    return { error: "An unexpected error occurred while deleting the school." }
  }
}

