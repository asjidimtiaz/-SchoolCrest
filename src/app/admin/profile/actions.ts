'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function updateProfile(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string
  const { userId } = await auth()

  if (!userId) return { error: 'Not authenticated', success: false }

  const supabase = supabaseAdmin

  // Fetch admin data early to use for both upload path and redirect logic
  const { data: adminData } = await supabase
    .from('admins')
    .select('school_id, role')
    .eq('id', userId)
    .single()

  const school_id = adminData?.school_id
  const isSuperAdmin = adminData?.role === 'super_admin'

  const avatar_url = formData.get('avatarUrl') as string || ''

  const { error } = await supabase
    .from('admins')
    .update({
      full_name: fullName,
      avatar_url: avatar_url
    })
    .eq('id', userId)

  if (error) {
    return { error: error.message, success: false }
  }

  // Comprehensive cache invalidation
  revalidatePath('/admin/profile')
  revalidatePath('/admin', 'layout')
  revalidatePath('/admin')

  if (isSuperAdmin) {
    revalidatePath('/admin/super/profile')
    revalidatePath('/admin/super', 'layout')
    // Avoid redirect to prevent state reset on current page
    return { success: true }
  }

  return { success: true }
}
