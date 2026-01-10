'use client'

import { TeamSeasonWithTeam } from '@/lib/getTeams'
import { Users, Trophy } from 'lucide-react'
import Link from 'next/link'

interface SeasonCardProps {
  season: TeamSeasonWithTeam
  primaryColor: string
}

export default function SeasonCard({ season, primaryColor }: SeasonCardProps) {
  // Prioritize season photo, fallback to team photo
  const photoUrl = (season as any).photo_url || season.team.photo_url

  return (
    <Link
      href={`/teams/${season.team.id}?season=${season.year}`}
      className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60 animate-slide-up"
    >
      {/* Image Container - Full Card */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={season.team.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <Users size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      {/* Top Badge: Year */}
      <div className="absolute top-6 left-6 z-10">
          <div className="px-5 py-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">{season.year}</span>
          </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-16 text-white transform transition-transform duration-500">
        <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                {season.team.gender}
            </span>
             <div className="w-1 h-1 rounded-full bg-white/30" />
             <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                {season.team.sport_category}
            </span>
        </div>

        {/* Team Name with Background for Contrast */}
        <div className="inline-block p-3 -ml-3 rounded-[1.5rem] mb-2" style={{ backgroundColor: `${primaryColor}E6` }}>
           <h3 className="text-3xl font-black leading-[1.1] text-shadow-lg text-white break-words">
               {season.team.name}
           </h3>
        </div>
        
        {season.coach && (
            <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em] drop-shadow-md mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                HC: {season.coach}
            </p>
        )}

        {/* Stats/Record Badge if available */}
        {season.record && (
            <div className="absolute top-0 right-8 -translate-y-full mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white shadow-xl border border-amber-400">
                    <Trophy size={14} fill="currentColor" />
                    <span className="text-xs font-black uppercase tracking-wider">{season.record}</span>
                </div>
            </div>
        )}
        
        {/* Interactive Indicator - Cohesive Button Style */}
        <div className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-slate-900 group-hover:scale-[1.02]">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">View Record</span>
          <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <span className="text-xs font-bold leading-none">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Outer Border Glow on Hover */}
      <div className="absolute inset-0 rounded-[3rem] border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
    </Link>
  )
}
