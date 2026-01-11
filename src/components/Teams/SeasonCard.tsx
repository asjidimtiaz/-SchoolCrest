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
  const photoUrl = season.photo_url || season.team.photo_url

  return (
    <Link
      href={`/teams/${season.team.id}?season=${season.year}`}
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60 animate-slide-up"
    >
      {/* Image Container - Full Card */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={season.team.name}
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

      {/* Top Badge: Year */}
      <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20">
              <span className="text-lg font-black text-slate-900 tracking-tighter">{season.year}</span>
          </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 pt-12 text-white transform transition-transform duration-500">
        <div className="flex items-center gap-2 mb-3">
             <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                {season.team.gender}
            </span>
        </div>
 
        {/* Team Name with Background for Contrast */}
        <div className="inline-block p-2.5 -ml-2.5 rounded-xl mb-1.5" style={{ backgroundColor: `${primaryColor}E6` }}>
           <h3 className="text-xl font-black leading-tight text-shadow-lg text-white break-words">
               {season.team.name}
           </h3>
        </div>
        
        {season.coach && (
            <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] drop-shadow-md mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
                HC: {season.coach}
            </p>
        )}

        {/* Stats/Record Badge if available */}
        {season.record && (
            <div className="absolute top-0 right-5 -translate-y-full mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white shadow-xl border border-amber-400">
                    <Trophy size={12} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{season.record}</span>
                </div>
            </div>
        )}
        
        {/* Interactive Indicator - Sleek Branded Style */}
        <div 
          className="flex items-center justify-between py-3 px-6 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500"
          style={{ '--hover-bg': primaryColor } as any}
        >
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] leading-none mb-1">Explore</span>
             <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">View Record</span>
          </div>
          
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500"
            style={{ backgroundColor: `${primaryColor}CC` }}
          >
            <Trophy size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Outer Border Glow - Constant */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 transition-colors duration-500 pointer-events-none" />
    </Link>
  )
}
