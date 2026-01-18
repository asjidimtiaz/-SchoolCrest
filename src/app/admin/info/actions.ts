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
  console.log('[DEBUG] updateSchoolBranding called. FormData keys:', Array.from(formData.keys()))
  try {
    const supabase = await getSupabase()
    
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const about_text = formData.get('about_text') as string
    const about_quote = formData.get('about_quote') as string
    const about_quote_author = formData.get('about_quote_author') as string
    const about_quote_show_marks = formData.get('about_quote_show_marks') === 'true'
    const about_text_show_marks = formData.get('about_text_show_marks') === 'true'
    const primary_color = formData.get('primary_color') as string
    const secondary_color = formData.get('secondary_color') as string
    const accent_color = formData.get('accent_color') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    // Handle Logo Upload
    let logo_url = formData.get('uploaded_logo_url') as string || formData.get('logo_url') as string
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
    let background_url = formData.get('uploaded_background_url') as string || 
                         formData.get('background_url') as string ||
                         formData.get('existing_background_url') as string || ''
    const background_type = formData.get('background_type') as string || 'image'

    // Handle Sponsor Logos (1-3)
    let sponsor_logo_1 = formData.get('uploaded_sponsor_logo_1') as string || 
                         formData.get('sponsor_logo_1') as string ||
                         formData.get('existing_sponsor_logo_1') as string || ''
    let sponsor_logo_2 = formData.get('uploaded_sponsor_logo_2') as string || 
                         formData.get('sponsor_logo_2') as string ||
                         formData.get('existing_sponsor_logo_2') as string || ''
    let sponsor_logo_3 = formData.get('uploaded_sponsor_logo_3') as string || 
                         formData.get('sponsor_logo_3') as string ||
                         formData.get('existing_sponsor_logo_3') as string || ''

    console.log('[DEBUG] Initial sponsor URLs:', { sponsor_logo_1, sponsor_logo_2, sponsor_logo_3 })

    // Redundant server-side upload loop removed (now handled client-side for better large file support)

    console.log('[DEBUG] Final sponsor URLs:', { sponsor_logo_1, sponsor_logo_2, sponsor_logo_3 })

    // Handle Gallery Images
    for (let index = 1; index <= 3; index++) {
        const uploadedUrl = formData.get(`uploaded_gallery_image_${index}`) as string || ''
        const isDeleted = formData.get(`deleted_gallery_image_${index}`) === 'true'
        const file = formData.get(`gallery_file_${index}`) as File | null

        if (isDeleted) {
            await supabase.from('screensaver_images').delete().eq('school_id', id).eq('order_index', index)
            // Legacy direct upload block removed (handled client-side)
        } else if (uploadedUrl) {
            // Upsert: delete old at index, insert new
            await supabase.from('screensaver_images').delete().eq('school_id', id).eq('order_index', index)
            await supabase.from('screensaver_images').insert({ school_id: id, image_url: uploadedUrl, order_index: index })
        }
    }

    const nav_hall_of_fame_label = formData.get('nav_hall_of_fame_label') as string
    const nav_teams_label = formData.get('nav_teams_label') as string
    const nav_calendar_label = formData.get('nav_calendar_label') as string
    const nav_info_label = formData.get('nav_info_label') as string
    const nav_hall_of_fame_tagline = formData.get('nav_hall_of_fame_tagline') as string
    const nav_teams_tagline = formData.get('nav_teams_tagline') as string
    const nav_calendar_tagline = formData.get('nav_calendar_tagline') as string
    const nav_info_tagline = formData.get('nav_info_tagline') as string

    // (Redundant update removed here, using the cleaner one below)
    
    // Explicitly update website_url separately if needed or just part of object above?
    // Let's fix the object above.
    
    // Re-doing the update object construction to be clean:
    const updatePayload: any = {
        name, tagline, about_text, about_quote, about_quote_author, about_quote_show_marks, about_text_show_marks,
        logo_url, primary_color, secondary_color, accent_color,
        address, phone, email, background_url, background_type,
        sponsor_logo_1, sponsor_logo_2, sponsor_logo_3,
        nav_hall_of_fame_label, nav_teams_label, nav_calendar_label, nav_info_label,
        nav_hall_of_fame_tagline, nav_teams_tagline, nav_calendar_tagline, nav_info_tagline
    };
    
    // If we are repurposing the 'email' input name for website_url, or if I change the form to send 'website_url'.
    // Use 'website_url' from formData.
    const website_url = formData.get('website_url') as string;
    if (website_url !== null) updatePayload.website_url = website_url;

    const facebook_url = formData.get('facebook_url') as string;
    if (facebook_url !== null) updatePayload.facebook_url = facebook_url;

    const instagram_url = formData.get('instagram_url') as string;
    if (instagram_url !== null) updatePayload.instagram_url = instagram_url;

    console.log('[DEBUG] --- FINAL UPDATE PAYLOAD ---')
    console.log('[DEBUG] School ID:', id)
    console.log('[DEBUG] Background URL:', updatePayload.background_url)
    console.log('[DEBUG] Background Type:', updatePayload.background_type)
    console.log('[DEBUG] -----------------------------')

    const { data: finalData, error: updateError } = await supabase.from('schools').update(updatePayload).eq('id', id).select();

    console.log('[DEBUG] Database update result:', { 
        success: !updateError, 
        error: updateError,
        updatedData: finalData ? {
            sponsor_logo_1: finalData[0]?.sponsor_logo_1,
            sponsor_logo_2: finalData[0]?.sponsor_logo_2,
            sponsor_logo_3: finalData[0]?.sponsor_logo_3
        } : null
    })

    if (updateError) {
      console.error("Error in updateSchoolBranding:", updateError.message)
      return { error: updateError.message }
    }
    
    // Force revalidation of the layout and all pages
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (err) {
    console.error("FATAL in updateSchoolBranding:", err)
    return { error: "An unexpected error occurred while updating the branding." }
  }
}

