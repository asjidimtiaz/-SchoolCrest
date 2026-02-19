'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function updateBranding(formData: FormData) {
    try {
        const id = formData.get('id') as string

        // Explicitly update only branding fields
        const primary_color = formData.get('primary_color') as string
        const secondary_color = formData.get('secondary_color') as string
        const accent_color = formData.get('accent_color') as string
        const background_url = formData.get('background_url') as string
        const background_type = formData.get('background_type') as string
        const logo_url = formData.get('logo_url') as string

        const updatePayload: any = {
            primary_color,
            secondary_color,
            accent_color,
            background_url,
            background_type,
            logo_url,
            // Nav Labels
            nav_hall_of_fame_label: formData.get('nav_hall_of_fame_label'),
            nav_teams_label: formData.get('nav_teams_label'),
            nav_calendar_label: formData.get('nav_calendar_label'),
            nav_info_label: formData.get('nav_info_label'),
            nav_hall_of_fame_tagline: formData.get('nav_hall_of_fame_tagline'),
            nav_teams_tagline: formData.get('nav_teams_tagline'),
            nav_calendar_tagline: formData.get('nav_calendar_tagline'),
            nav_info_tagline: formData.get('nav_info_tagline'),
            // Sponsors
            sponsor_logo_1: formData.get('sponsor_logo_1'),
            sponsor_logo_2: formData.get('sponsor_logo_2'),
            sponsor_logo_3: formData.get('sponsor_logo_3'),
        }

        // Handle Gallery Images (Screensaver Images)
        for (let index = 1; index <= 3; index++) {
            const uploadedUrl = formData.get(`uploaded_gallery_image_${index}`) as string
            const isDeleted = formData.get(`deleted_gallery_image_${index}`) === 'true'

            if (isDeleted) {
                await supabaseAdmin.from('screensaver_images').delete().eq('school_id', id).eq('order_index', index)
            } else if (uploadedUrl) {
                await supabaseAdmin.from('screensaver_images').delete().eq('school_id', id).eq('order_index', index)
                await supabaseAdmin.from('screensaver_images').insert({
                    school_id: id,
                    image_url: uploadedUrl,
                    order_index: index
                })
            }
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
