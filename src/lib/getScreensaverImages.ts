import { createClient } from '@supabase/supabase-js'

export interface ScreensaverImage {
  id: string
  school_id: string
  image_url: string
  order_index: number
  created_at: string
}

export async function getScreensaverImages(schoolId: string): Promise<ScreensaverImage[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase vars in getScreensaverImages');
      return [];
    }

    // Create fresh client to avoid singleton issues
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    )

    const { data, error } = await supabase
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
