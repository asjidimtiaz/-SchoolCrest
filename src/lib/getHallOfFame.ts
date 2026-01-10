import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface Inductee {
  id: string
  name: string
  year: string
  category: string
  photo_url: string | null
  video_url?: string | null
  bio: string
  achievements: string[]
  school_id: string
  induction_year: number | null
}

export async function getHallOfFame(schoolId: string): Promise<Inductee[]> {
  try {
    const cookieStore = await cookies()
    
    // Create authenticated client to respect RLS
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
          },
        }
      )

    // Authenticated access check (Optional for read)
    const { data: { user } } = await supabase.auth.getUser()
    // We allow public access for Kiosk, but warn for logging
    if (!user) {
        console.log('[getHallOfFame] Public access (no user)')
    }

    const { data, error } = await supabase
      .from('hall_of_fame')
      .select('*')
      .eq('school_id', schoolId)
      .order('year', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching Hall of Fame:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getHallOfFame:', err instanceof Error ? err.message : err)
    return []
  }
}

