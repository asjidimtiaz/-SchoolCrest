import { getSchool } from '@/lib/getSchool'
import EventForm from '../EventForm'

export default async function NewEventPage() {
  const school = await getSchool()
  if (!school) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">New Event</h1>
        <p className="text-gray-500 mt-1">Add a new event to the calendar</p>
      </div>

      <EventForm schoolId={school.id} />
    </div>
  )
}
