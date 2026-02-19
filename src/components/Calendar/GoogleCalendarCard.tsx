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
    <div
      className="group relative flex gap-6 p-6 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] border shadow-lg hover:shadow-xl mb-4 ml-4 ring-1 ring-white/10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}25 0%, rgba(20,20,30,0.4) 100%)`, // Increased opacity and darker base
        borderColor: `${primaryColor}60`, // Stronger border
        boxShadow: `0 8px 32px -8px ${primaryColor}20` // Added glow
      }}
    >

      {/* Accent Bar (Google Color) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2" // Thicker accent
        style={{ backgroundColor: primaryColor }}
      />

      {/* Date & Time Column */}
      <div className="flex flex-col items-center justify-center min-w-[6rem] text-center border-r border-white/10 pr-6 gap-2">
        <div className="flex flex-col items-center mb-1">
          <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.25em] leading-none mb-1.5">
            {startDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-5xl font-black text-white leading-none tracking-tighter drop-shadow-xl scale-y-110">
            {startDate.getDate()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-3 py-1">

        <h3 className="text-2xl font-bold text-white leading-tight tracking-tight pr-4 drop-shadow-md break-words whitespace-normal line-clamp-2">
          {event.summary || (event.description ? (event.description.length > 50 ? event.description.substring(0, 50) + '...' : event.description) : 'Untitled Event')}
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
