'use client'

import { SchoolEvent } from '@/lib/getEvents'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'

interface EventCardProps {
  event: SchoolEvent
  primaryColor: string
}

export default function EventCard({ event, primaryColor }: EventCardProps) {
  const startDate = new Date(event.start_time)
  const dateStr = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="group relative flex items-start gap-8 glass-card border-none rounded-[2.5rem] p-8 shadow-soft hover:shadow-premium transition-all duration-500 animate-slide-up">
      {/* Date Badge */}
      <div 
        className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-[2rem] bg-white shadow-soft group-hover:scale-105 transition-transform duration-500 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        <div className="relative flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">{startDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-4xl font-black text-gray-900 leading-none">{startDate.getDate()}</span>
        </div>
        {/* Dynamic Accent */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-red-500/20" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-3xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-black transition-colors max-w-xl">
                {event.title}
            </h3>
            {event.category && (
                <span className="px-4 py-1.5 bg-white/50 border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {event.category}
                </span>
            )}
        </div>
        
        <div className="flex flex-wrap gap-6 text-gray-400">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Clock size={16} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{timeStr}</span>
             </div>
             {event.location && (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{event.location}</span>
                </div>
             )}
        </div>

        {event.description && (
            <div className="mt-6 flex items-start gap-4">
              <div className="w-1 h-full min-h-[1.5rem] bg-gray-100 rounded-full" />
              <p className="text-gray-500 font-medium leading-relaxed max-w-2xl text-lg italic">
                "{event.description}"
              </p>
            </div>
        )}
      </div>

      {/* Left Accent Marker */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-gray-100 rounded-r-full group-hover:bg-[var(--color-primary)] group-hover:h-24 transition-all duration-500" style={{ backgroundColor: primaryColor }} />
    </div>
  )
}
