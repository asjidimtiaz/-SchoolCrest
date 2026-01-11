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
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60"
    >
      {/* Image Container */}
      <div className="relative flex-1 w-full bg-slate-50 overflow-hidden">
        {inductee.photo_url && !hasError ? (
          <img
            src={inductee.photo_url}
            alt={inductee.name}
            className="w-full h-full object-cover transition-transform duration-700"
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
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 pt-10 text-white transform transition-transform duration-500">
        <div className="flex items-center justify-between mb-3">
          <div 
              className="inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg bg-white/10 backdrop-blur-md border border-white/10"
              style={{ backgroundColor: primaryColor }}
          >
              {inductee.year}
          </div>
          <div className="h-0.5 w-4 rounded-full bg-white/20" />
        </div>

        {/* Name with Background for Contrast */}
        <div className="inline-block p-2 -ml-2 rounded-xl mb-1.5" style={{ backgroundColor: `${primaryColor}E6` }}>
           <h3 className="text-xl font-black leading-tight text-shadow-lg text-white break-words">{inductee.name}</h3>
        </div>
        
        <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em] drop-shadow-md mb-4">{inductee.category}</p>
        
        {/* Interactive Indicator - Sleek Branded Style */}
        <div 
           className="flex items-center justify-between py-3 px-6 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500"
        >
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] leading-none mb-1">Biography</span>
             <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">View Archive</span>
          </div>
          
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500"
            style={{ backgroundColor: `${primaryColor}CC` }}
          >
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Outer Border Glow - Constant */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 transition-colors duration-500 pointer-events-none" />
    </button>
  )

}
