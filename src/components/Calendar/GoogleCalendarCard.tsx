'use client'

import { GoogleCalendarEvent } from '@/lib/googleCalendar'
import { MapPin, Clock, Globe } from 'lucide-react'

interface GoogleCalendarCardProps {
  event: GoogleCalendarEvent
  primaryColor: string
}

export default function GoogleCalendarCard({ event, primaryColor }: GoogleCalendarCardProps) {
  // Parsing date strictly from Google Event generic object
  const startDate = new Date(event.start.dateTime || event.start.date || '')

  // Handling All Day events (which have date but no dateTime)
  const isAllDay = !event.start.dateTime
  const timeStr = isAllDay ? 'All Day' : startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="group relative flex gap-6 p-6 bg-white/10 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:bg-white/15 border border-white/10 shadow-lg hover:shadow-xl hover:shadow-[#4285F4]/10 mb-4 ml-4 ring-1 ring-white/5 overflow-hidden">

      {/* Accent Bar (Google Color) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: '#4285F4' }} // Google Blue
      />

      {/* Date & Time Column */}
      <div className="flex flex-col items-center justify-center min-w-[5.5rem] text-center border-r border-white/10 pr-6 gap-1">
        <div className="flex flex-col items-center mb-1">
          <span className="text-[10px] font-black text-[#4285F4]/60 uppercase tracking-[0.2em] leading-none mb-1">
            {startDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-3xl font-black text-white leading-none tracking-tighter">
            {startDate.getDate()}
          </span>
        </div>

        <div className="h-px w-4 bg-white/10 my-1" />

        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-white/80 leading-none tracking-tight">
            {isAllDay ? '24' : startDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false })}
          </span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
            {isAllDay ? 'HR' : (
              <>
                {startDate.toLocaleTimeString('en-US', { minute: '2-digit' }) === '00' ? '' : startDate.toLocaleTimeString('en-US', { minute: '2-digit' })}
                <span className="ml-0.5">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).slice(-2)}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">

        <h3 className="text-xl font-bold text-white leading-tight tracking-tight truncate pr-4">
          {event.summary}
        </h3>

        <div className="flex items-center gap-4">
          {/* Time Detail */}
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock size={12} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {timeStr}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-1.5 text-white/60">
              <MapPin size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[200px]">
                {event.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
