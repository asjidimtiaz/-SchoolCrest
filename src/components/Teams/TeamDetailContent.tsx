'use client'

import { useState } from 'react'
import { Team, TeamSeason } from '@/lib/getTeams'
import { useBranding } from '@/context/BrandingContext'
import BackButton from '@/components/BackButton'
import KioskHeader from '@/components/KioskHeader'
import { Trophy, Calendar, Users, MapPin, Info, ArrowRight, X } from 'lucide-react'

interface TeamDetailContentProps {
  team: Team
  seasons: TeamSeason[]
  seasonYear?: string
}

export default function TeamDetailContent({ team, seasons, seasonYear }: TeamDetailContentProps) {
  const branding = useBranding()
  const [activeSeason, setActiveSeason] = useState<TeamSeason | null>(
      seasonYear ? seasons.find(s => s.year.toString() === seasonYear) || null : null
  )

  // Close modal handler
  const closeSeason = () => setActiveSeason(null)

  // Use team background or photo for the main hero
  const heroPhotoUrl = team.background_url || team.photo_url

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
        <KioskHeader pageTitle="Team Archive" />

        {/* 🏆 High-Impact Hero Section */}
        <div className="relative z-10 w-full overflow-hidden pt-12 pb-24 shrink-0">
            {/* Branded Color Wash Background */}
            <div className="absolute inset-0 z-0">
                {heroPhotoUrl ? (
                    <>
                        <img 
                            src={heroPhotoUrl} 
                            className="w-full h-full object-cover opacity-80" 
                            alt="" 
                        />
                        <div 
                            className="absolute inset-0 opacity-85 mix-blend-multiply"
                            style={{ background: `linear-gradient(to bottom, ${branding.primaryColor}, ${branding.secondaryColor})` }}
                        />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
                    </>
                ) : (
                    <div 
                        className="w-full h-full opacity-10"
                        style={{ backgroundColor: branding.primaryColor }}
                    />
                )}
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-12 h-full flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-3 mb-8 animate-in fade-in zoom-in duration-700">
                    <div 
                        className="p-3 rounded-2xl text-white shadow-xl shadow-black/20 border border-white/20"
                        style={{ backgroundColor: branding.primaryColor }}
                    >
                        <Trophy size={28} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 leading-none">
                            {team.gender} Athletics
                        </span>
                        <div className="h-1 w-12 rounded-full bg-white/40" />
                    </div>
                </div>

                <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase">
                    {team.name}
                </h1>
            </div>
        </div>

        {/* 📂 Archive Grid - The "Directory" of Seasons */}
        <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-12 pb-36 overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-black uppercase tracking-widest text-slate-300 mb-8 border-b-2 border-slate-100 pb-4">Season Archive</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {seasons.map((season) => (
                    <button 
                        key={season.id} 
                        onClick={() => setActiveSeason(season)}
                        className="group relative w-full aspect-[4/3] rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left overflow-hidden bg-slate-900 flex flex-col justify-end"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            {(season.photo_url || team.photo_url) ? (
                                <img 
                                    src={season.photo_url || team.photo_url || ''} 
                                    alt={`${season.year} Season`}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-end justify-between">
                                <span className="text-6xl font-black text-white tracking-tighter leading-none">{season.year}</span>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/90">
                                        Record: {season.record || 'N/A'}
                                    </div>
                                    {season.coach && (
                                         <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 truncate max-w-[120px]">
                                            {season.coach}
                                         </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Visual Border Highlight */}
                        <div className="absolute inset-0 border-2 border-white/10 rounded-[2.5rem] z-20 pointer-events-none group-hover:border-white/30 transition-colors" />
                    </button>
                ))}

                {seasons.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-50">
                        <Trophy size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">No archived seasons found</p>
                    </div>
                )}
            </div>
        </div>

        {/* 🪟 The "Season Window" Modal */}
        {activeSeason && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeSeason} />
                
                <div className="relative w-full max-w-6xl max-h-full bg-[#FAFAFA] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 shrink-0">
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{activeSeason.year} Season</h2>
                            <div className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest">
                                {activeSeason.record || 'Archived'}
                            </div>
                        </div>
                        <button 
                            onClick={closeSeason}
                            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <X size={24} className="text-slate-900" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* Left: Summary & Media (7 cols) */}
                            <div className="lg:col-span-7 space-y-8">
                                {/* Season Photo */}
                                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-100">
                                    {(activeSeason.photo_url || team.photo_url) ? (
                                        <img 
                                            src={activeSeason.photo_url || team.photo_url || ''} 
                                            className="w-full h-full object-cover" 
                                            alt={`${activeSeason.year} Team`} 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Users size={64} />
                                        </div>
                                    )}
                                     
                                     {/* Champions Badge Overlay */}
                                     {activeSeason.achievements && activeSeason.achievements.some((a: string) => a.toLowerCase().includes('state')) && (
                                        <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg border-2 border-white flex items-center gap-2">
                                            <Trophy size={14} fill="currentColor" />
                                            State Champs
                                        </div>
                                     )}
                                </div>

                                {/* Summary */}
                                {activeSeason.summary && (
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                            <Info size={14} /> Season Details
                                        </h4>
                                        <p className="text-lg text-slate-800 font-medium leading-relaxed">
                                            {activeSeason.summary}
                                        </p>
                                    </div>
                                )}

                                {/* Honors Grid */}
                                {(activeSeason.achievements?.length > 0 || activeSeason.individual_accomplishments) && (
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Awards & Honors</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {activeSeason.achievements?.map((ach: string, i: number) => (
                                                <div key={i} className="px-5 py-3 bg-amber-50 text-amber-800 border-amber-100 border rounded-2xl font-bold text-sm flex items-center gap-2">
                                                    <Trophy size={14} /> {ach}
                                                </div>
                                            ))}
                                            {activeSeason.individual_accomplishments && (
                                                 <div className="w-full p-5 bg-emerald-50 text-emerald-900 border-emerald-100 border rounded-2xl font-medium text-sm leading-relaxed whitespace-pre-line mt-2">
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Individual Honors</span>
                                                    {activeSeason.individual_accomplishments}
                                                 </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Roster (5 cols) */}
                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden h-full flex flex-col">
                                    <div className="bg-slate-50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-black text-slate-900 text-lg tracking-tight">Season Roster</h3>
                                        <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {Array.isArray(activeSeason.roster) ? activeSeason.roster.length : 0} Players
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 overflow-y-auto custom-scrollbar flex-1 max-h-[500px]">
                                        {activeSeason.roster && Array.isArray(activeSeason.roster) && activeSeason.roster.length > 0 ? (
                                            <div className="space-y-2">
                                                {activeSeason.roster.map((player: any) => (
                                                    <div key={player.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0">
                                                            {player.jersey_number || '#'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-black text-slate-900 text-base truncate">{player.name}</div>
                                                            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold truncate">
                                                                {player.position} {player.grade && `• ${player.grade}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-40 flex flex-col items-center justify-center text-slate-300">
                                                <Users size={32} className="mb-2 opacity-50" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">No Roster Available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* Floating Centered Back Button */}
        <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none">
            <div className="pointer-events-auto active:scale-95 duration-200">
                <BackButton href="/teams" label="Return to Directory" className="px-10 py-3.5 text-sm font-black shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white text-slate-900 border border-gray-100 rounded-full" />
            </div>
        </div>
    </main>
  )
}
