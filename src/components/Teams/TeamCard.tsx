'use client'

import { Team } from '@/lib/getTeams'
import { Users } from 'lucide-react'
import Link from 'next/link'

interface TeamCardProps {
  team: Team
  primaryColor: string
}

export default function TeamCard({ team, primaryColor }: TeamCardProps) {
  const photoUrl = team.photo_url

  return (
    <Link
      href={`/teams/${team.id}`}
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60 animate-slide-up"
    >
      {/* Image Container - Full Card */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={team.name}
            className="w-full h-full object-cover transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <Users size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-70 transition-opacity duration-500" />
      </div>

      {/* Content Overlay - Simplified to just Name */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-12 text-white text-center">
        {/* Team Name with Background for Contrast */}
        <div 
          className="inline-block px-6 py-3 rounded-2xl shadow-2xl border border-white/10" 
          style={{ backgroundColor: `${primaryColor}CC`, backdropFilter: 'blur(8px)' }}
        >
           <h3 className="text-2xl font-black leading-tight text-white break-words tracking-tight uppercase">
               {team.name}
           </h3>
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mt-1">
               {team.gender} {team.sport_category || 'Athletics'}
           </p>
        </div>
      </div>

      {/* Outer Border Glow - Constant */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 pointer-events-none" />
    </Link>
  )
}
