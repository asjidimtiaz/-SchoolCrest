'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'



export async function updateSchoolInfo(formData: FormData) {
  try {
    const id = formData.get('id') as string

    const updatePayload: any = {
      name: formData.get('name'),
      tagline: formData.get('tagline'),
      about_text: formData.get('about_text'),
      about_quote: formData.get('about_quote'),
      about_quote_author: formData.get('about_quote_author'),
      about_quote_show_marks: formData.get('about_quote_show_marks') === 'true',
      about_text_show_marks: formData.get('about_text_show_marks') === 'true',
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      website_url: formData.get('website_url'),
      facebook_url: formData.get('facebook_url'),
      instagram_url: formData.get('instagram_url'),
    }

    const { error: updateError } = await supabaseAdmin
      .from('schools')
      .update(updatePayload)
      .eq('id', id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." }
  }
}

