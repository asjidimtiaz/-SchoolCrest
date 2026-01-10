import { getSchool } from '@/lib/getSchool'
import { getEvents } from '@/lib/getEvents'
import { Plus, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import { format } from 'date-fns'

export default async function CalendarAdminPage() {
  const school = await getSchool()
  if (!school) return null

  const events = await getEvents(school.id)

  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">Scheduling</span>
               <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Events Calendar</h1>
            <p className="text-sm text-gray-500 font-medium tracking-tight">Keep your community updated with events.</p>
        </div>
        <Link
            href="/admin/calendar/new"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white font-black rounded-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md text-[10px] uppercase"
        >
            <Plus size={14} />
            Add Event
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border-none text-[13px] text-left">
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-50/50">
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Event Details</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Date & Time</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Location</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/30">
                {events.map((event: any) => (
                    <tr key={event.id} className="hover:bg-white/50 transition-colors group">
                        <td className="px-4 py-3">
                            <div className="min-w-0">
                                <p className="text-sm font-black text-gray-900 leading-tight truncate">{event.title}</p>
                                <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase tracking-widest rounded-full text-gray-400 border border-gray-200 inline-block mt-1">
                                    {event.category}
                                </span>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <p className="text-sm font-bold text-gray-700">{format(new Date(event.start_time), 'MMM d, yyyy')}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{format(new Date(event.start_time), 'h:mm a')}</p>
                        </td>
                        <td className="px-4 py-3">
                            <p className="text-[11px] text-gray-600 font-bold truncate max-w-[150px]">{event.location}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                                <Link 
                                    href={`/admin/calendar/${event.id}/edit`}
                                    className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm"
                                    title="Edit"
                                >
                                    <Edit size={14} />
                                </Link>
                                <DeleteButton id={event.id} />
                            </div>
                        </td>
                    </tr>
                ))}
                
                {events.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-8 py-12 text-center">
                            <div className="flex flex-col items-center max-w-xs mx-auto">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-3 border border-gray-100">
                                    <Calendar size={24} />
                                </div>
                                <p className="text-gray-900 font-black text-base mb-1">Calendar Open</p>
                                <p className="text-gray-400 text-[11px] font-medium leading-relaxed">No upcoming events found. Keep your community informed by adding school events.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>

  )
}
