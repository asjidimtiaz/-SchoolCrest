import { Team, TeamSeason } from '@/lib/getTeams'
import { Users, Calendar } from 'lucide-react'
import Link from 'next/link'

interface TeamCardProps {
  team: Team
  season?: TeamSeason
  primaryColor: string
  showYear?: boolean
}

export default function TeamCard({ team, season, primaryColor, showYear }: TeamCardProps) {
  const photoUrl = season?.photo_url || team.photo_url
  return (
    <Link
      href={`/teams/${team.id}${showYear && season ? `?season=${season.year}` : ''}`}
      className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-lg transition-all duration-500 text-left w-full aspect-[3/4.2] border border-slate-200/50 animate-in fade-in slide-in-from-bottom-8"
    >
      {/* Image Container - Full Card */}
      <div className="absolute inset-0 w-full h-full bg-slate-100 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${team.name} ${season?.year || ''}`}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Users size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
      </div>

      {/* Year Badge - Top Right */}
      {showYear && (
          <div className="absolute top-6 right-6 z-20">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20">
                  <Calendar size={14} className="text-slate-500" />
                  <span className="text-sm font-black text-slate-900">{season?.year}</span>
              </div>
          </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 pb-10 text-white pointer-events-none">
        <div className="space-y-3">
            <div 
              className="inline-block px-5 py-2.5 rounded-2xl shadow-2xl border border-white/10" 
              style={{ backgroundColor: `${primaryColor}EE`, backdropFilter: 'blur(12px)' }}
            >
               <h3 className="text-xl font-black leading-tight text-white tracking-tight uppercase">
                   {team.name}
               </h3>
            </div>
            
            <div className="flex items-center gap-3 ml-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                   {team.gender}
                </span>
            </div>
        </div>
      </div>

      {/* Glossy Overlay Effect on Hover */}
      <div className="absolute inset-0 rounded-[2.5rem] border-[3px] border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
    </Link>
  )
}
