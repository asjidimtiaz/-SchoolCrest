import { getSchool } from '@/lib/getSchool'
import { getTeam, getTeamSeasons } from '@/lib/getTeams'
import BackButton from '@/components/BackButton'
import { Trophy, Calendar, Users } from 'lucide-react'

export default async function TeamDetailPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ id: string }>, 
    searchParams: Promise<{ season?: string }> 
}) {
  const { id } = await params
  const { season: seasonYear } = await searchParams
  
  const school = await getSchool()
  const team = await getTeam(id)
  const allSeasons = await getTeamSeasons(id)

  if (!school || !team) return <div>Team not found</div>
  
  // Filter if season param is present
  const seasons = seasonYear 
    ? allSeasons.filter(s => s.year.toString() === seasonYear)
    : allSeasons

  // Get selected season photo if seasonYear is provided
  const selectedSeason = seasonYear ? seasons.find(s => s.year.toString() === seasonYear) : null
  const heroPhotoUrl = selectedSeason?.photo_url || team.photo_url

  return (
    <main className="min-h-screen bg-gray-50">
         {/* Hero Header */}
        <div className="relative bg-gray-900 text-white py-16 px-8 overflow-hidden">
             {/* Background Blur */}
             {heroPhotoUrl && (
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
                    style={{ backgroundImage: `url(${heroPhotoUrl})` }}
                />
             )}
             
            <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
                <BackButton href="/teams" label="Back to Teams" />
                <div className="mt-8 relative z-10 w-full flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-widest text-white">
                            {team.gender}
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-widest text-white">
                            {team.sport_category}
                        </span>
                    </div>
                    
                    <h1 className="text-6xl font-black tracking-tight mb-4 text-white drop-shadow-xl">{team.name}</h1>
                    
                    {/* Championship Banner Logic */}
                    {seasons.length > 0 && seasons[0].achievements && seasons[0].achievements.some((a: string) => a.toLowerCase().includes('state')) && (
                        <div className="bg-amber-400 text-amber-950 px-8 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 mb-6 border-2 border-amber-200">
                             <Trophy size={28} strokeWidth={2.5} />
                             <span className="text-xl font-black uppercase tracking-widest">State Champions {seasons[0].year}</span>
                             <Trophy size={28} strokeWidth={2.5} />
                        </div>
                    )}
                    
                    {seasonYear && (
                        <div className="px-6 py-2 rounded-lg bg-white/10 backdrop-blur-md inline-block border border-white/10">
                             <span className="text-xl font-bold text-white/90">{seasonYear} Season</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Timeline Content */}
        <div className="max-w-5xl mx-auto px-8 py-12 pb-32">
             <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Calendar className="text-gray-400" />
                {seasonYear ? `${seasonYear} Season Details` : 'Season History'}
             </h2>

             <div className="space-y-6">
                {seasons.map((season) => (
                    <div key={season.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Media Section (Year + Photo) */}
                        <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-48">
                            <div className="relative aspect-video rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                                {season.photo_url || team.photo_url ? (
                                    <img 
                                        src={season.photo_url || team.photo_url || ''} 
                                        alt={`${season.year} Season`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <Users size={40} />
                                    </div>
                                )}
                                {/* Year Badge Overlay */}
                                <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-black/5">
                                    <span className="text-lg font-black text-gray-900">{season.year}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                             <div className="flex items-center gap-4 mb-2">
                                 <h3 className="text-xl font-bold text-gray-800">Record: {season.record}</h3>
                                 <span className="text-gray-300">|</span>
                                 <div className="flex items-center gap-2 text-gray-600">
                                    <Users size={16} />
                                    <span className="text-sm font-medium">HC: {season.coach}</span>
                                 </div>
                             </div>

                             {/* Achievements */}
                             {(season.achievements?.length > 0) && (
                                 <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Team Honors</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {season.achievements.map((ach: string, i: number) => {
                                            const isChamp = ach.toLowerCase().includes('champion');
                                            return (
                                                <span 
                                                    key={i} 
                                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 border ${
                                                        isChamp 
                                                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                                        : 'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}
                                                >
                                                    <Trophy size={14} className={isChamp ? "text-amber-500" : "text-gray-400"} />
                                                    {ach}
                                                </span>
                                            );
                                        })}
                                    </div>
                                 </div>
                             )}

                             {/* Individual Accomplishments */}
                             {(season as any).individual_accomplishments && (
                                 <div className="pt-4">
                                     <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">Individual Championships & Honors</h4>
                                     <div className="whitespace-pre-line text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                         {(season as any).individual_accomplishments}
                                     </div>
                                 </div>
                             )}

                             {/* Roster */}
                             {season.roster && Array.isArray(season.roster) && season.roster.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users size={16} className="text-gray-400" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Season Roster</h4>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-xl p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {season.roster.map((player: any) => (
                                                <div key={player.id} className="bg-white rounded-lg p-3 border border-gray-100">
                                                    <div className="font-bold text-gray-900">{player.name}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {player.position && <span>{player.position}</span>}
                                                        {player.grade && <span> • {player.grade}</span>}
                                                        {player.jersey_number && <span> • #{player.jersey_number}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                ))}

                {seasons.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p>No season history available yet.</p>
                    </div>
                )}
             </div>
        </div>
    </main>
  )
}
