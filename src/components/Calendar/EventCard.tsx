'use client'

import { SchoolEvent } from '@/lib/getEvents'
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react'

interface EventCardProps {
  event: SchoolEvent
  primaryColor: string
}

export default function EventCard({ event, primaryColor }: EventCardProps) {
  const startDate = new Date(event.start_time)
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="group relative flex items-center gap-6 py-5 px-10 bg-white/10 backdrop-blur-2xl rounded-full transition-all duration-500 hover:bg-white/15 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] ml-20 mb-3 ring-1 ring-white/10 hover:ring-white/30 overflow-hidden active:scale-[0.98]">
      
      {/* Premium Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      {/* Time Column: Prominent & Clean */}
      <div className="flex-shrink-0">
        <span className="text-sm font-black text-white/80 tracking-widest uppercase">{timeStr}</span>
      </div>

      {/* Branded Separator Dot: Glowing Accent */}
      <div 
        className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-2 ring-white/10 flex-shrink-0" 
        style={{ 
          backgroundColor: primaryColor,
          boxShadow: `0 0 20px ${primaryColor}60`
        }}
      />

      {/* Content: Centered & Balanced */}
      <div className="flex-1 min-w-0 flex items-center gap-6">
        <h3 className="text-xl font-black text-white leading-none tracking-tight truncate lowercase">
            {event.title}
        </h3>
        
        {/* Location Indicator: Minimal & High-End */}
        {event.location && (
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 truncate max-w-[200px]">
                 {event.location}
             </span>
          </div>
        )}
      </div>

      {/* Details Indicator: Subtle Pulse (if description exists) */}
      {event.description && (
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white/60 transition-colors" />
          </div>
      )}
    </div>
  )
}


