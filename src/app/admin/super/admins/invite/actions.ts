'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function sendAdminInvite(prevState: any, formData: FormData) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: "Server configuration error" }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    
    const email = formData.get('email') as string
    const school_id = formData.get('school_id') as string
    const role = formData.get('role') as string

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    
    // Set expiry to 72 hours
    const expires_at = new Date()
    expires_at.setHours(expires_at.getHours() + 72)

    // Check if email already has pending invite
    const { data: existingInvite } = await supabase
      .from('admin_invites')
      .select('id')
      .eq('email', email)
      .is('accepted_at', null)
      .single()

    if (existingInvite) {
      return { error: "An invite for this email is already pending" }
    }

    // Check if user already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', email)
      .single()

    // Create invite
    const { error: inviteError } = await supabase
      .from('admin_invites')
      .insert({
        email,
        school_id: role === 'super_admin' ? null : school_id,
        role,
        token,
        expires_at: expires_at.toISOString(),
      })

    if (inviteError) {
      console.error("Error creating invite:", inviteError.message)
      return { error: inviteError.message }
    }

    // In production, send email with invite link
    // For now, we'll just log the invite URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/accept-invite?token=${token}`
    console.log('=== ADMIN INVITE ===')
    console.log(`Email: ${email}`)
    console.log(`Invite URL: ${inviteUrl}`)
    console.log('====================')

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // await sendInviteEmail(email, inviteUrl, schoolName)

    revalidatePath('/admin/super/admins/invite')
    return { success: true, inviteUrl }
  } catch (err) {
    console.error("FATAL in sendAdminInvite:", err)
    return { error: "Failed to send invite" }
  }
}
