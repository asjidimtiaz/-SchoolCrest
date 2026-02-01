import { supabaseAdmin } from './supabaseAdmin'

export interface ScreensaverImage {
  id: string
  school_id: string
  image_url: string
  order_index: number
  created_at: string
}

export async function getScreensaverImages(schoolId: string): Promise<ScreensaverImage[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('screensaver_images')
      .select('*')
      .eq('school_id', schoolId)
      .order('order_index', { ascending: true })
      .limit(6) // Fetch a few for the gallery

    if (error) {
      console.error('Error fetching screensaver images:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getScreensaverImages:', err instanceof Error ? err.message : err)
    return []
  }
}
