'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing in info/actions.ts");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle edge case
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle edge case
          }
        },
      },
    }
  )
}

export async function updateSchoolBranding(prevState: any, formData: FormData) {
  try {
    const supabase = await getSupabase()
    
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const about_text = formData.get('about_text') as string
    const primary_color = formData.get('primary_color') as string
    const secondary_color = formData.get('secondary_color') as string
    const accent_color = formData.get('accent_color') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const calendar_url = formData.get('calendar_url') as string

    // Handle Logo Upload
    let logo_url = formData.get('logo_url') as string
    const logoFile = formData.get('logo_file') as File | null

    if (logoFile && logoFile.size > 0 && typeof logoFile !== 'string') {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${id}/${Date.now()}_logo.${fileExt}`
        const filePath = `logos/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('school-assets')
            .upload(filePath, logoFile, { upsert: true })

        if (uploadError) {
             console.error('Error uploading logo:', uploadError.message)
             return { error: "Failed to upload logo: " + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('school-assets')
            .getPublicUrl(filePath)
        
        logo_url = publicUrl
    }

    // Handle Background Media Upload
    let background_url = formData.get('existing_background_url') as string || ''
    const background_type = formData.get('background_type') as string || 'image'
    const backgroundFile = formData.get('background_file') as File | null

    if (backgroundFile && backgroundFile.size > 0 && typeof backgroundFile !== 'string') {
        const fileExt = backgroundFile.name.split('.').pop()
        const fileName = `${id}/${Date.now()}_background.${fileExt}`
        const filePath = `backgrounds/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('school-assets')
            .upload(filePath, backgroundFile, { upsert: true })

        if (uploadError) {
             console.error('Error uploading background:', uploadError.message)
             return { error: "Failed to upload background: " + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('school-assets')
            .getPublicUrl(filePath)
        
        background_url = publicUrl
    }

    // Handle Sponsor Logos (1-3) - URLs now uploaded by client
    let sponsor_logo_1 = formData.get('uploaded_sponsor_logo_1') as string || formData.get('existing_sponsor_logo_1') as string || ''
    let sponsor_logo_2 = formData.get('uploaded_sponsor_logo_2') as string || formData.get('existing_sponsor_logo_2') as string || ''
    let sponsor_logo_3 = formData.get('uploaded_sponsor_logo_3') as string || formData.get('existing_sponsor_logo_3') as string || ''

    // Handle Gallery Images - URLs now uploaded by client
    for (let index = 1; index <= 3; index++) {
        const uploadedUrl = formData.get(`uploaded_gallery_image_${index}`) as string || ''
        if (uploadedUrl) {
            // Upsert: delete old at index, insert new
            await supabase.from('screensaver_images').delete().eq('school_id', id).eq('order_index', index)
            await supabase.from('screensaver_images').insert({ school_id: id, image_url: uploadedUrl, order_index: index })
        }
    }

    // (Redundant update removed here, using the cleaner one below)
    
    // Explicitly update website_url separately if needed or just part of object above?
    // Let's fix the object above.
    
    // Re-doing the update object construction to be clean:
    const updatePayload: any = {
        name, tagline, about_text, logo_url, primary_color, secondary_color, accent_color,
        address, phone, calendar_url, background_url, background_type,
        sponsor_logo_1, sponsor_logo_2, sponsor_logo_3
    };
    
    // If we are repurposing the 'email' input name for website_url, or if I change the form to send 'website_url'.
    // Use 'website_url' from formData.
    const website_url = formData.get('website_url') as string;
    if (website_url !== null) updatePayload.website_url = website_url;

    const facebook_url = formData.get('facebook_url') as string;
    if (facebook_url !== null) updatePayload.facebook_url = facebook_url;

    const instagram_url = formData.get('instagram_url') as string;
    if (instagram_url !== null) updatePayload.instagram_url = instagram_url;

    const { data: finalData, error: updateError } = await supabase.from('schools').update(updatePayload).eq('id', id).select();

    if (updateError) {
      console.error("Error in updateSchoolBranding:", updateError.message)
      return { error: updateError.message }
    }
    
    // ... existing verification logic ...
    
    return { success: true }
  } catch (err) {
    console.error("FATAL in updateSchoolBranding:", err)
    return { error: "An unexpected error occurred while updating the branding." }
  }
}

