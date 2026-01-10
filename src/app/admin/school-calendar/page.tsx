import { getSchool } from '@/lib/getSchool'
import CalendarForm from './CalendarForm'

export default async function SchoolCalendarPage() {
  const school = await getSchool()
  if (!school) return null

  return (
    <div className="space-y-6 pb-4 animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full border border-blue-100">Calendar</span>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">School Calendar</h1>
            <p className="text-sm text-gray-500 font-medium tracking-tight">Embed your Google Calendar for public display.</p>
        </div>
      </div>

      <CalendarForm school={school} />
    </div>
  )
}
