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

    const photo_url = formData.get('photo_url') as string || ''
    const video_url = formData.get('video_url') as string || ''

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
    const photo_url = formData.get('photo_url') as string || ''
    const video_url = formData.get('video_url') as string || ''

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


