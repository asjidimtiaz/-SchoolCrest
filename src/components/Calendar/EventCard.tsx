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

      {/* Date & Time Column */}
      <div className="flex flex-col items-center justify-center min-w-[5.5rem] text-center border-r border-white/10 pr-6 gap-1">
        <div className="flex flex-col items-center mb-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">
            {startDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-3xl font-black text-white leading-none tracking-tighter">
            {startDate.getDate()}
          </span>
        </div>

        <div className="h-px w-4 bg-white/10 my-1" />

        <div className="flex flex-col items-center">
          <span className="text-xs font-black text-white/80 leading-none tracking-tight">
            {startDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false })}
          </span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
            {startDate.toLocaleTimeString('en-US', { minute: '2-digit' }) === '00' ? '' : startDate.toLocaleTimeString('en-US', { minute: '2-digit' })}
            <span className="ml-0.5">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).slice(-2)}</span>
          </span>
        </div>
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


