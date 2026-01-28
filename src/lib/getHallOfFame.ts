import { supabasePublic } from './supabaseServer'

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

    const supabase = supabasePublic;

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

