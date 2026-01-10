'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function createAdminAccount(prevState: any, formData: FormData) {
  try {
    // Use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: "Server configuration error: Missing Supabase credentials" }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string
    const school_id = formData.get('school_id') as string | null

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError.message)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Failed to create user" }
    }

    // Create the admin record
    const { error: adminError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: authData.user.id,
        school_id: role === 'school_admin' ? school_id : null,
        role,
        active: true,
      })

    if (adminError) {
      console.error("Error creating admin record:", adminError.message)
      // Try to delete the auth user if admin record creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { error: adminError.message }
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in createAdminAccount:", err)
    return { error: "An unexpected error occurred while creating the admin account." }
  }
}
