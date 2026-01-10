'use client'

import { useState } from 'react'
import { Inductee } from '@/lib/getHallOfFame'
import { User, Play } from 'lucide-react'

interface InducteeCardProps {
  inductee: Inductee
  onSelect: (inductee: Inductee) => void
  primaryColor: string
}

export default function InducteeCard({ inductee, onSelect, primaryColor }: InducteeCardProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <button
      onClick={() => onSelect(inductee)}
      className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60"
    >
      {/* Image Container */}
      <div className="relative flex-1 w-full bg-slate-50 overflow-hidden">
        {inductee.photo_url && !hasError ? (
          <img
            src={inductee.photo_url}
            alt={inductee.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
            <User size={64} strokeWidth={1} />
          </div>
        )}
        
        {inductee.video_url && (
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white z-20 shadow-2xl group-hover:scale-110 group-hover:bg-black/40 transition-all duration-500">
                <Play size={20} fill="currentColor" className="ml-1" />
            </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-12 text-white transform transition-transform duration-500">
        <div className="flex items-center justify-between mb-4">
          <div 
              className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg bg-white/10 backdrop-blur-md border border-white/10"
              style={{ backgroundColor: primaryColor }}
          >
              {inductee.year}
          </div>
          <div className="h-1 w-6 rounded-full bg-white/20" />
        </div>

        {/* Name with Background for Contrast */}
        <div className="inline-block p-2.5 -ml-2.5 rounded-xl mb-2" style={{ backgroundColor: `${primaryColor}E6` }}>
           <h3 className="text-3xl font-black leading-[1.1] text-shadow-lg text-white break-words">{inductee.name}</h3>
        </div>
        
        <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em] drop-shadow-md mb-6">{inductee.category}</p>
        
        {/* Interactive Indicator - Cohesive Button Style */}
        <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-slate-900 group-hover:scale-[1.02]">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">View Archive</span>
          <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <span className="text-xs font-bold leading-none">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Outer Border Glow on Hover */}
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
    </button>
  )

}
