'use client'

import { useState } from 'react'
import { Program, ProgramSeason } from '@/lib/getPrograms'
import { useRouter } from 'next/navigation'
import { useBranding } from '@/context/BrandingContext'
import BackButton from '@/components/BackButton'
import KioskHeader from '@/components/KioskHeader'
import { Trophy, Users, X, Film, FileText, LayoutGrid } from 'lucide-react'
import { isVideoUrl } from '@/lib/mediaDetection'
import RecordsViewModal from './RecordsViewModal'
import TrophyCaseModal from './TrophyCaseModal'

interface ProgramDetailContentProps {
    program: Program
    seasons: ProgramSeason[]
    seasonYear?: string
}

export default function ProgramDetailContent({ program, seasons, seasonYear }: ProgramDetailContentProps) {
    const router = useRouter()
    const branding = useBranding()
    const [activeSeason, setActiveSeason] = useState<ProgramSeason | null>(
        seasonYear ? seasons.find(s => s.year.toString() === seasonYear) || null : null
    )
    const [showRecords, setShowRecords] = useState(false)
    const [showTrophyCase, setShowTrophyCase] = useState(false)

    // Close modal handler
    const closeSeason = () => {
        if (seasonYear && activeSeason?.year.toString() === seasonYear) {
            router.push('/programs')
        } else {
            setActiveSeason(null)
        }
    }

    // Use program background or photo for the main hero
    const heroPhotoUrl = program.background_url || program.photo_url

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
            <KioskHeader pageTitle="Program Archive" />

            {/* 🏆 High-Impact Hero Section */}
            <div className="relative z-10 w-full overflow-hidden pt-12 pb-24 shrink-0">
                {/* Branded Color Wash Background */}
                <div className="absolute inset-0 z-0">
                    {heroPhotoUrl ? (
                        <>
                            {program.media_type === 'video' || isVideoUrl(heroPhotoUrl) ? (
                                <video
                                    src={heroPhotoUrl}
                                    className="w-full h-full object-cover opacity-80"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={heroPhotoUrl}
                                    className="w-full h-full object-cover opacity-80"
                                    alt=""
                                />
                            )}
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

                    </div>

                    <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase">
                        {program.name}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {program.records && program.records.length > 0 && (
                            <button
                                onClick={() => setShowRecords(true)}
                                className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all shadow-xl hover:scale-105 text-xs uppercase tracking-[0.2em]"
                            >
                                <FileText size={18} strokeWidth={3} />
                                Record Board
                            </button>
                        )}

                        {program.trophy_case_activated && program.trophy_case_items && program.trophy_case_items.length > 0 && (
                            <button
                                onClick={() => setShowTrophyCase(true)}
                                className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all shadow-xl hover:scale-105 text-xs uppercase tracking-[0.2em]"
                            >
                                <LayoutGrid size={18} strokeWidth={3} />
                                Digital Trophy Case
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 📂 Archive Grid - The "Directory" of Seasons */}
            <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-8 md:px-12 pb-36 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-10 border-b-2 border-slate-100 pb-6">
                    <div className="w-1.5 h-10 bg-black rounded-full" />
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"> history</span>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">All Seasons</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {seasons.map((season) => (
                        <button
                            key={season.id}
                            onClick={() => setActiveSeason(season)}
                            className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left w-full aspect-[3/4] border border-gray-100"
                        >

                            {/* Image Container - Takes available space */}
                            <div className="relative flex-1 w-full bg-slate-100 overflow-hidden transition-opacity">
                                {(() => {
                                    const photoUrl = season.photo_url || program.photo_url;
                                    const isVideo = isVideoUrl(photoUrl);

                                    if (!photoUrl) return (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                            <Users size={64} strokeWidth={1} />
                                        </div>
                                    );

                                    return (
                                        <>
                                            {/* Blurred Background */}
                                            <div
                                                className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
                                                style={{ backgroundImage: `url(${photoUrl})` }}
                                            />
                                            {isVideo ? (
                                                <video
                                                    src={photoUrl}
                                                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={photoUrl}
                                                    alt={`${season.year} Season`}
                                                    className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                                                />
                                            )}

                                            {isVideo && (
                                                <div className="absolute bottom-20 right-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80">
                                                    <Film size={12} />
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Championship Badges Overlay on Card */}
                                {season.achievements && season.achievements.length > 0 && (
                                    <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 z-20">
                                        {season.achievements.includes('State Champions') && (
                                            <div className="bg-amber-400 text-amber-950 px-3 py-1.5 rounded-xl font-black uppercase tracking-[0.1em] text-[9px] shadow-xl border border-white/20 flex items-center gap-2 self-start animate-fade-in">
                                                <Trophy size={12} fill="currentColor" />
                                                State Champions
                                            </div>
                                        )}
                                        {season.achievements.includes('Region Champions') && (
                                            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl font-black uppercase tracking-[0.1em] text-[9px] shadow-xl border border-white/10 flex items-center gap-2 self-start animate-fade-in">
                                                <Trophy size={12} fill="currentColor" />
                                                Region Champions
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Subtle inner shadow for depth */}
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
                            </div>

                            {/* Separator Line */}
                            <div className="h-1.5 w-full relative z-10" style={{ backgroundColor: branding.primaryColor }} />

                            {/* White Footer Section */}
                            <div className="bg-white px-4 py-5 flex flex-col items-center justify-center relative z-10 text-center">
                                <h3 className="text-xl font-black leading-none text-slate-900 uppercase tracking-tight line-clamp-2">
                                    {season.year} Season
                                </h3>
                                <div className="mt-1 flex items-center gap-1.5 opacity-60">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        {season.record}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}

                    {seasons.length === 0 && (
                        <div className="col-span-full py-32 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Trophy size={40} strokeWidth={1} />
                            </div>
                            <p className="text-sm font-black uppercase tracking-widest text-slate-400">No archived seasons found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 🪟 The "Season Window" Modal */}
            {activeSeason && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={closeSeason} />

                    <div className="relative w-full max-w-7xl max-h-full bg-white rounded-[4rem] shadow-premium overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">

                        {/* Header */}
                        <div className="flex items-center justify-between px-12 py-2 bg-white border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="w-1.5 h-12 bg-black rounded-full" />
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Season review</span>
                                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{activeSeason.year} Season</h2>
                                </div>

                                {/* Championship Badges in Header */}
                                {activeSeason.achievements && activeSeason.achievements.length > 0 && (
                                    <div className="flex flex-wrap gap-4 ml-8">
                                        {activeSeason.achievements.includes('State Champions') && (
                                            <div className="bg-amber-400 text-amber-950 px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-xl border-2 border-white/50 flex items-center gap-3">
                                                <Trophy size={18} fill="currentColor" />
                                                State Champions
                                            </div>
                                        )}
                                        {activeSeason.achievements.includes('Region Champions') && (
                                            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-xl border-2 border-slate-200/50 flex items-center gap-3">
                                                <Trophy size={18} fill="currentColor" />
                                                Region Champions
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="px-6 py-2.5 bg-gray-50 border border-gray-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ml-auto">
                                    RECORD HIGHLIGHT: <span className="text-slate-900 ml-1">{activeSeason.record || 'N/A'}</span>
                                </div>
                                {activeSeason.coach && (
                                    <div className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 ml-2 flex items-center gap-3">
                                        <Users size={14} strokeWidth={3} className="text-slate-400" />
                                        <span>HEAD COACH: <span className="text-slate-900 ml-1">{activeSeason.coach}</span></span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={closeSeason}
                                className="w-16 h-16 rounded-[2rem] bg-gray-50 hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm border border-gray-100 group"
                            >
                                <X size={28} strokeWidth={3} className="text-slate-900 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                                {/* Left: Summary & Media (7 cols) */}
                                <div className="lg:col-span-7 space-y-10">
                                    {/* Season Photo */}
                                    <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-premium border border-gray-100 relative bg-gray-50">
                                        {(() => {
                                            const photoUrl = activeSeason.photo_url || program.photo_url;
                                            const isVideo = isVideoUrl(photoUrl);

                                            if (!photoUrl) return (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <Users size={80} strokeWidth={1} />
                                                </div>
                                            );

                                            return (
                                                <>
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                                                        style={{ backgroundImage: `url(${photoUrl})` }}
                                                    />
                                                    {isVideo ? (
                                                        <video
                                                            key={photoUrl}
                                                            src={photoUrl}
                                                            className="w-full h-full object-contain relative z-10"
                                                            autoPlay
                                                            muted
                                                            loop
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={photoUrl}
                                                            className="w-full h-full object-contain relative z-10"
                                                            alt={`${activeSeason.year} Program`}
                                                        />
                                                    )}
                                                </>
                                            );
                                        })()}

                                        {/* Championships Banner Overlay - Managed in Header now, but keeping for visual flair if needed */}
                                        {/* {activeSeason.achievements && activeSeason.achievements.length > 0 && ( ... )} */}
                                    </div>

                                    {/* Summary */}
                                    {activeSeason.summary && (
                                        <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                Season Narrative
                                            </h4>
                                            <p className="text-xl text-slate-800 font-medium leading-relaxed tracking-tight">
                                                {activeSeason.summary}
                                            </p>
                                        </div>
                                    )}

                                    {/* Individual Accomplishments Detail */}
                                    {activeSeason.achievements?.includes('Individual Honors') && activeSeason.individual_accomplishments && (
                                        <div className="bg-emerald-50/30 p-10 rounded-[3rem] border border-emerald-100/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Hall of Individual Honors
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {activeSeason.individual_accomplishments.split('\n').filter(Boolean).map((line: string, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-5 p-5 bg-white rounded-3xl border border-emerald-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:scale-[1.01] hover:shadow-lg">
                                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                                            <Trophy size={18} strokeWidth={2.5} />
                                                        </div>
                                                        <span className="text-lg font-black text-emerald-950 uppercase tracking-tight">{line}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Roster (5 cols) */}
                                <div className="lg:col-span-5 h-full">
                                    <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-premium overflow-hidden h-full flex flex-col">
                                        <div className="bg-slate-50/50 px-10 py-8 border-b border-gray-100 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Program members</span>
                                                <h3 className="font-black text-slate-950 text-2xl tracking-tight uppercase">Season Roster</h3>
                                            </div>
                                            <div className="px-5 py-2 bg-white border border-gray-200 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                                                {Array.isArray(activeSeason.roster) ? activeSeason.roster.length : 0} Players
                                            </div>
                                        </div>

                                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 max-h-[700px]">
                                            {activeSeason.roster && Array.isArray(activeSeason.roster) && activeSeason.roster.length > 0 ? (
                                                <div className="space-y-3">
                                                    {activeSeason.roster.map((player: any) => (
                                                        <div key={player.id} className="group flex items-center gap-5 p-4 hover:bg-slate-50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100">
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                                                                {player.jersey_number || '#'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-black text-slate-950 text-lg truncate uppercase tracking-tight">{player.name}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-64 flex flex-col items-center justify-center text-slate-200">
                                                    <Users size={48} strokeWidth={1} className="mb-4 opacity-30" />
                                                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">No Roster Record</p>
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

            {/* Records View Modal */}
            {showRecords && program.records && (
                <RecordsViewModal
                    records={program.records}
                    programName={program.name}
                    onClose={() => setShowRecords(false)}
                />
            )}

            {/* Trophy Case Modal */}
            {showTrophyCase && program.trophy_case_items && (
                <TrophyCaseModal
                    items={program.trophy_case_items}
                    programName={program.name}
                    onClose={() => setShowTrophyCase(false)}
                />
            )}

            {/* Floating Centered Back Button */}
            <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none">
                <div className="pointer-events-auto active:scale-95 duration-200">
                    <BackButton href="/programs" label="Return to Directory" className="px-10 py-3.5 text-sm font-black shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white text-slate-900 border border-gray-100 rounded-full" />
                </div>
            </div>
        </main>
    )
}
