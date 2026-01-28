import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getScreensaverImages(schoolId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('screensaver_images')
            .select('*')
            .eq('school_id', schoolId)
            .order('order_index')

        if (error) {
            console.error('Error fetching screensaver images:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Unexpected error fetching screensaver images:', error)
        return []
    }
}
