'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', success: false }

  // Fetch admin data early to use for both upload path and redirect logic
  const { data: adminData } = await supabase
    .from('admins')
    .select('school_id, role')
    .eq('id', user.id)
    .single()

  const school_id = adminData?.school_id
  const isSuperAdmin = adminData?.role === 'super_admin'

  let avatar_url = formData.get('avatarUrl') as string || ''
  const avatarFile = formData.get('avatar_file') as File | null

  // Handle Image Upload
  if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== 'string') {
    let filePath = ''
    
    if (school_id) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      filePath = `avatars/${school_id}/${fileName}`
    } else if (isSuperAdmin) {
      // Fallback for super admins or system users
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      filePath = `avatars/system/${fileName}`
    }

    if (filePath) {
      const { error: uploadError } = await supabase.storage
        .from('school-assets')
        .upload(filePath, avatarFile)

      if (uploadError) {
        console.error('Avatar upload error:', uploadError.message)
        return { error: `Upload failed: ${uploadError.message}`, success: false }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('school-assets')
        .getPublicUrl(filePath)
      
      avatar_url = publicUrl
    }
  }

  const { error } = await supabase
    .from('admins')
    .update({ 
      full_name: fullName,
      avatar_url: avatar_url
    })
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error.message)
    return { error: error.message, success: false }
  }
  
  // Comprehensive cache invalidation
  revalidatePath('/admin/profile')
  revalidatePath('/admin', 'layout')
  revalidatePath('/admin')
  
  if (isSuperAdmin) {
    revalidatePath('/admin/super/profile')
    revalidatePath('/admin/super', 'layout')
    redirect('/admin/super/profile')
  }
  
  // Force a redirect to ensure layout refetches
  redirect('/admin/profile')
}
