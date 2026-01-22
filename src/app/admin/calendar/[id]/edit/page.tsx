import { getSchool } from '@/lib/getSchool'
import { getSupabaseServer } from '@/lib/supabaseServer'
import EventForm from '../../EventForm'
import { notFound } from 'next/navigation'

async function getEvent(id: string, supabase: any) {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
    
    if (error) return null
    return data
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  const supabase = await getSupabaseServer()
  const event = await getEvent(id, supabase)

  if (!school || !event) return notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Edit Event</h1>
        <p className="text-gray-500 mt-1">Update event details</p>
      </div>

      <EventForm schoolId={school.id} event={event} isEdit={true} />
    </div>
  )
}
