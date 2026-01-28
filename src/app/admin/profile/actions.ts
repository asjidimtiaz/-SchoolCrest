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

  let avatar_url = formData.get('avatarUrl') as string || ''
  const avatarFile = formData.get('avatar_file') as File | null

  // Handle Image Upload
  if (avatarFile && avatarFile.size > 0 && typeof avatarFile !== 'string') {
    let filePath = ''

    if (school_id) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      filePath = `avatars/${school_id}/${fileName}`
    } else if (isSuperAdmin) {
      // Fallback for super admins or system users
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      filePath = `avatars/system/${fileName}`
    }

    if (filePath) {
      try {
        // Check if bucket exists
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        if (bucketError) {
          console.error('[updateProfile] Failed to list buckets:', bucketError)
          return { error: `Storage configuration error: ${bucketError.message}`, success: false }
        }

        const bucketExists = buckets?.some(b => b.name === 'school-assets')
        if (!bucketExists) {
          await supabase.storage.createBucket('school-assets', { public: true })
        }

        // Convert File to ArrayBuffer for more reliable upload in Node environments
        const arrayBuffer = await avatarFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-assets')
          .upload(filePath, buffer, {
            upsert: true,
            contentType: avatarFile.type || 'image/png'
          })

        if (uploadError) {
          console.error('[updateProfile] Avatar upload error details:', uploadError)
          return { error: `Upload failed: ${uploadError.message}`, success: false }
        }

        const { data: { publicUrl } } = supabase.storage
          .from('school-assets')
          .getPublicUrl(filePath)

        avatar_url = publicUrl
      } catch (uploadExc: any) {
        console.error('[updateProfile] CRITICAL EXCEPTION during upload:', uploadExc)
        return { error: `Server error during upload: ${uploadExc.message || 'Unknown error'}`, success: false }
      }
    }
  }

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
