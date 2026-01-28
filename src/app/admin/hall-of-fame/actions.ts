'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'



export async function deleteInductee(id: string) {
  try {
    const { error } = await supabaseAdmin.from('hall_of_fame').delete().eq('id', id)

    if (error) {
      console.error("Error in deleteInductee:", error.message)
      throw new Error(error.message)
    }

    revalidatePath('/admin/hall-of-fame')
  } catch (err) {
    console.error("FATAL in deleteInductee:", err)
    throw err;
  }
}

export async function createInductee(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const year = formData.get('year') as string
    const induction_year = parseInt(formData.get('induction_year') as string) || null
    const category = formData.get('category') as string
    const bio = formData.get('bio') as string
    const achievements = (formData.get('achievements') as string).split('\n').filter(Boolean)
    const school_id = formData.get('school_id') as string

    // Image Handling
    const photoFile = formData.get('photo_file') as File | null
    let photo_url = formData.get('photo_url') as string || ''

    if (photoFile && photoFile.size > 0 && typeof photoFile !== 'string') {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `inductees/${school_id}/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('school-assets')
        .upload(filePath, photoFile)

      if (uploadError) {
        console.error("Upload error:", uploadError.message)
        return { error: `Upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('school-assets')
        .getPublicUrl(filePath)

      photo_url = publicUrl
    }

    // Video Handling
    const videoFile = formData.get('video_file') as File | null
    let video_url = formData.get('video_url') as string || ''

    if (videoFile && videoFile.size > 0 && typeof videoFile !== 'string') {
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${Date.now()}-video-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `inductees/${school_id}/videos/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('school-assets')
        .upload(filePath, videoFile)

      if (uploadError) {
        console.error("Video upload error:", uploadError.message)
        return { error: `Video upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('school-assets')
        .getPublicUrl(filePath)

      video_url = publicUrl
    }

    const { error } = await supabaseAdmin.from('hall_of_fame').insert({
      name, year, category, photo_url, video_url, bio, achievements, school_id, induction_year
    })

    if (error) {
      console.error("Error in createInductee:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/hall-of-fame')
    return { success: true }
  } catch (err) {
    console.error("FATAL in createInductee:", err)
    return { error: "An unexpected error occurred while creating the inductee." }
  }
}

export async function updateInductee(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const year = formData.get('year') as string
    const induction_year = parseInt(formData.get('induction_year') as string) || null
    const category = formData.get('category') as string
    const bio = formData.get('bio') as string
    const achievements = (formData.get('achievements') as string).split('\n').filter(Boolean)
    const school_id = formData.get('school_id') as string // We need this for the upload path

    // Image Handling
    const photoFile = formData.get('photo_file') as File | null
    let photo_url = formData.get('photo_url') as string || ''

    if (photoFile && photoFile.size > 0 && typeof photoFile !== 'string') {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `inductees/${school_id}/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('school-assets')
        .upload(filePath, photoFile)

      if (uploadError) {
        console.error("Upload error:", uploadError.message)
        return { error: `Upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('school-assets')
        .getPublicUrl(filePath)

      photo_url = publicUrl
    }

    // Video Handling
    const videoFile = formData.get('video_file') as File | null
    let video_url = formData.get('video_url') as string || ''

    if (videoFile && videoFile.size > 0 && typeof videoFile !== 'string') {
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${Date.now()}-video-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `inductees/${school_id}/videos/${fileName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('school-assets')
        .upload(filePath, videoFile)

      if (uploadError) {
        console.error("Video upload error:", uploadError.message)
        return { error: `Video upload failed: ${uploadError.message}` }
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('school-assets')
        .getPublicUrl(filePath)

      video_url = publicUrl
    }

    const { error } = await supabaseAdmin.from('hall_of_fame').update({
      name, year, category, photo_url, video_url, bio, achievements, induction_year
    }).eq('id', id)

    if (error) {
      console.error("Error in updateInductee:", error.message)
      return { error: error.message }
    }

    revalidatePath('/admin/hall-of-fame')
    return { success: true }
  } catch (err) {
    console.error("FATAL in updateInductee:", err)
    return { error: "An unexpected error occurred while updating the inductee." }
  }
}


