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
    <div
      className="group relative flex gap-6 p-6 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] border shadow-lg hover:shadow-xl mb-4 ml-4 ring-1 ring-white/10 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}25 0%, rgba(20,20,30,0.4) 100%)`,
        borderColor: `${primaryColor}60`,
        boxShadow: `0 8px 32px -8px ${primaryColor}20`
      }}
    >

      {/* Accent Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ backgroundColor: primaryColor }}
      />

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


