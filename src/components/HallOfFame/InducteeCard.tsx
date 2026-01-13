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
        

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
      </div>

      {/* Top Badge: Year */}
      <div className="absolute top-5 left-5 z-20">
          <div className="px-4 py-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
              <span className="text-xl font-black text-slate-900 tracking-tighter">{inductee.year}</span>
          </div>
      </div>

      {/* Content Overlay - Simplified to just Name */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-12 text-white text-center z-10">
        {/* Name with Background for Contrast */}
        <div 
          className="inline-block px-6 py-3 rounded-2xl shadow-2xl border border-white/10" 
          style={{ backgroundColor: `${primaryColor}CC`, backdropFilter: 'blur(8px)' }}
        >
           <h3 className="text-2xl font-black leading-tight text-white break-words tracking-tight uppercase">
               {inductee.name}
           </h3>
        </div>
      </div>

      {/* Outer Border Glow - Constant */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 pointer-events-none z-20" />
    </button>
  )
}
