'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function createAdminAccount(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string
    const school_id = formData.get('school_id') as string | null

    if (!email || !password || !role) {
      return { error: "Missing required fields" }
    }

    // 1. Create User in Clerk
    let clerkUser;
    try {
      const client = await clerkClient()
      clerkUser = await client.users.createUser({
        emailAddress: [email],
        password,
        skipPasswordChecks: false,
        skipPasswordRequirement: false,
      })
    } catch (err: any) {
      console.error("Clerk Create Error:", err)
      // Extract nice error message if possible
      const message = err.errors?.[0]?.longMessage || err.message || "Failed to create user in Clerk"
      return { error: message }
    }

    if (!clerkUser) {
      return { error: "Failed to create user in Clerk (Unknown error)" }
    }

    // 2. Create Admin Record in Supabase (using Clerk ID)
    const { error: adminError } = await supabaseAdmin
      .from('admins')
      .insert({
        id: clerkUser.id,
        email: email, // Store email for reference/display
        school_id: role === 'school_admin' ? school_id : null,
        role,
        active: true,
        full_name: '', // Optional, or prompt for it
      })

    if (adminError) {
      console.error("Error creating details record:", adminError.message)
      // Rollback Clerk user if DB fails (Best Effort)
      try {
        const client = await clerkClient()
        await client.users.deleteUser(clerkUser.id)
      } catch (delErr) {
        console.error("Failed to rollback Clerk user:", delErr)
      }
      return { error: "Failed to save admin details: " + adminError.message }
    }

    revalidatePath('/admin/super/admins')
    return { success: true }
  } catch (err) {
    console.error("FATAL in createAdminAccount:", err)
    return { error: "An unexpected error occurred." }
  }
}
