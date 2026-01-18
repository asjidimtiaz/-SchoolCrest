'use client'

import { format } from 'date-fns'

interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
}

interface GoogleCalendarCardProps {
  event: GoogleCalendarEvent
  primaryColor: string
}

export default function GoogleCalendarCard({ event, primaryColor }: GoogleCalendarCardProps) {
  const start = event.start.dateTime || event.start.date
  if (!start) return null
  
  const startDate = new Date(start)
  const month = format(startDate, 'MMM').toUpperCase()
  const day = format(startDate, 'd')
  
  const startTime = event.start.dateTime ? format(new Date(event.start.dateTime), 'h:mm a') : 'All Day'
  const endTime = event.end.dateTime ? format(new Date(event.end.dateTime), 'h:mm a') : ''
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime

  return (
    <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100/50 p-8 flex flex-col gap-6 hover:shadow-[0_15px_50px_rgba(0,0,0,0.12)] transition-all duration-500 group">
      <div className="flex items-center gap-6">
        {/* Date Box */}
        <div className="flex-shrink-0 w-16 h-18 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="h-6 flex items-center justify-center text-[10px] font-black tracking-widest text-white px-2" style={{ backgroundColor: primaryColor }}>
            {month}
          </div>
          <div className="flex-1 flex items-center justify-center text-2xl font-black text-slate-800 bg-white">
            {day}
          </div>
        </div>

        {/* Title & Label */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upcoming Event</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight">
                {event.summary}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {timeRange}
        </p>
        {event.description && (
          <p className="text-sm font-bold text-slate-400 leading-tight line-clamp-2">
            {event.description}
          </p>
        )}
        {event.location && (
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-2">
            📍 {event.location}
          </p>
        )}
      </div>
    </div>
  )
}
