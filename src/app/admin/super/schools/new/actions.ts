'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function createSchoolWithBranding(prevState: any, formData: FormData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: "Server configuration error" }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const is_demo = formData.get('is_demo') === 'true'
    const primary_color = formData.get('primary_color') as string
    const secondary_color = formData.get('secondary_color') as string
    const accent_color = formData.get('accent_color') as string
    const tagline = formData.get('tagline') as string

    // Create school
    const { data: school, error } = await supabase.from('schools').insert({
      name,
      slug,
      is_demo,
      active: true,
      primary_color,
      secondary_color,
      accent_color,
      tagline,
    }).select().single()

    if (error) {
      console.error("Error creating school:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/super')
    return { success: true, schoolId: school.id }
  } catch (err) {
    console.error("FATAL in createSchoolWithBranding:", err)
    return { error: "An unexpected error occurred" }
  }
}
