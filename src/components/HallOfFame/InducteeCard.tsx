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
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left w-full aspect-[3/4] border border-gray-100"
    >
      {/* Top Badge: Induction Year */}
      <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-1.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20">
              <span className="text-sm font-black text-slate-900 tracking-tighter">
                {inductee.induction_year || inductee.year}
              </span>
          </div>
      </div>

      {/* Image Container - Takes available space */}
      <div className="relative flex-1 w-full bg-slate-100 overflow-hidden  transition-opacity">
        {inductee.photo_url && !hasError ? (
          <>
            {/* Blurred Background for non-aspect images */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
              style={{ backgroundImage: `url(${inductee.photo_url})` }}
            />
            <img
              src={inductee.photo_url}
              alt={inductee.name}
              className="w-full h-full object-contain relative z-10 transition-transform duration-700 pointer-events-none"
              onError={() => setHasError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <User size={64} strokeWidth={1} />
          </div>
        )}
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
      </div>

      {/* Separator Line */}
      <div className="h-1.5 w-full relative z-10" style={{ backgroundColor: primaryColor }} />

      {/* White Footer Section */}
      <div className="bg-white px-4 py-5 flex items-center justify-center relative z-10">
        <h3 className="text-xl font-black leading-none text-slate-900 text-center uppercase tracking-tight line-clamp-2">
            {inductee.name}
        </h3>
      </div>
    </button>
  )
}
