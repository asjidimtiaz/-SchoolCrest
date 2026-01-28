'use client'

import { SchoolEvent } from '@/lib/getEvents'
import { MapPin, Clock } from 'lucide-react'

interface EventCardProps {
  event: SchoolEvent
  primaryColor: string
}

export default function EventCard({ event, primaryColor }: EventCardProps) {
  const startDate = new Date(event.start_time)
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="group relative flex gap-6 p-6 bg-white/10 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:bg-white/15 border border-white/10 shadow-lg hover:shadow-xl mb-4 ml-4 ring-1 ring-white/5 overflow-hidden">

      {/* Accent Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Time Column */}
      <div className="flex flex-col items-center pt-1 min-w-[4rem] text-center border-r border-white/10 pr-6">
        <span className="text-xl font-black text-white leading-none tracking-tight">
          {startDate.toLocaleTimeString('en-US', { hour: 'numeric' })}
        </span>
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">
          {startDate.toLocaleTimeString('en-US', { minute: '2-digit' }) === '00' ? '' : startDate.toLocaleTimeString('en-US', { minute: '2-digit' })}
          <span className="ml-1">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).slice(-2)}</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
        <h3 className="text-xl font-bold text-white leading-tight tracking-tight truncate pr-4">
          {event.title}
        </h3>

        <div className="flex items-center gap-4">
          {/* Category / Time Detail */}
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


