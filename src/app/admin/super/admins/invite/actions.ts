'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function sendAdminInvite(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const school_id = formData.get('school_id') as string
    const role = formData.get('role') as string

    // 1. Create Clerk Invitation
    const clerk = await clerkClient()
    const invitation = await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin`,
      publicMetadata: {
        role,
        school_id: role === 'super_admin' ? null : school_id,
      },
    })

    // 2. Pre-create record in Supabase for authorization
    // We use the email as a temporary ID until they sign in
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin')

    const { error: adminError } = await supabaseAdmin
      .from('admins')
      .upsert({
        id: email, // Temporary ID (Clerk ID will replace this on first login)
        email: email,
        role: role,
        school_id: role === 'super_admin' ? null : school_id,
        active: true
      }, { onConflict: 'email' })

    if (adminError) {
      console.error("Error pre-creating admin record:", adminError.message)
      // We don't fail the whole invite if DB sync fails, but we log it
    }

    revalidatePath('/admin/super/admins/invite')
    return { success: true }
  } catch (err: any) {
    console.error("FATAL in sendAdminInvite:", err)
    return { error: err.message || "Failed to send invitation via Clerk" }
  }
}
