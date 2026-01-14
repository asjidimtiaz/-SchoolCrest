import { supabaseServer } from './supabaseServer'

export interface SchoolEvent {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string | null
  location: string | null
  category: string | null
  school_id: string
}

export async function getEvents(schoolId: string): Promise<SchoolEvent[]> {
  const now = new Date().toISOString()
  
  const { data, error } = await supabaseServer
    .from('events')
    .select('*')
    .eq('school_id', schoolId)
    .gte('start_time', now) // Only upcoming events
    .order('start_time', { ascending: true })
    .limit(50)

  if (error) {
    console.error('Error fetching Events for school:', schoolId, JSON.stringify(error, null, 2))
    return []
  }

  return data || []
}
