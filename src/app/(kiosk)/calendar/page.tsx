import { getSchool } from '@/lib/getSchool'
import { getEvents } from '@/lib/getEvents'
import CalendarContent from '@/components/Calendar/CalendarContent'

export default async function CalendarPage() {
  const school = await getSchool()
  
  if (!school) return null

  const events = await getEvents(school.id)

  return <CalendarContent school={school} events={events} />;
}
