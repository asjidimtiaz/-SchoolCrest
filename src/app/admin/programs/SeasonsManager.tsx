'use client'

import { useState, useEffect } from 'react'
import { ProgramSeason } from '@/lib/getPrograms'
import DeleteButton from './DeleteButton'
import RosterModal from './RosterModal'
import SeasonEditModal from './SeasonEditModal'
import SeasonForm from './SeasonForm'
import { Edit, Users, Plus, X, Film } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { isVideoUrl } from '@/lib/mediaDetection'

interface SeasonsManagerProps {
    seasons: ProgramSeason[]
    programId: string
    programName: string
    schoolId: string
    onRefresh?: () => void
}

export default function SeasonsManager({ seasons, programId, programName, schoolId, onRefresh }: SeasonsManagerProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [selectedSeasonForRoster, setSelectedSeasonForRoster] = useState<ProgramSeason | null>(null)
    const [selectedSeasonForEdit, setSelectedSeasonForEdit] = useState<ProgramSeason | null>(null)
    const [isRosterOpen, setIsRosterOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(searchParams.get('add') === 'true')

    useEffect(() => {
        if (searchParams.get('add') === 'true') {
            setIsAddOpen(true)
        }
    }, [searchParams])

    const handleOpenRoster = (season: ProgramSeason) => {
        setSelectedSeasonForRoster(season)
        setIsRosterOpen(true)
    }

    const handleOpenEdit = (season: ProgramSeason) => {
        setSelectedSeasonForEdit(season)
        setIsEditOpen(true)
    }

    // Calculate the next logical year (highest year + 1)
    const nextSuggestedYear = seasons.length > 0
        ? Math.max(...seasons.map(s => s.year)) + 1
        : new Date().getFullYear()

    return (
        <div className="space-y-6 text-left pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Archive History</h2>
                <button
                    onClick={() => {
                        setIsAddOpen(!isAddOpen)
                        if (!isAddOpen) {
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                    }}
                    className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${isAddOpen
                        ? 'bg-white text-gray-400 hover:text-black hover:shadow-2xl'
                        : 'bg-black text-white hover:bg-gray-800'
                        }`}
                >
                    {isAddOpen ? <X size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                    {isAddOpen ? 'Cancel' : 'Add Season'}
                </button>
            </div>

            {isAddOpen && (
                <div className="animate-slide-up relative bg-white/30 rounded-[3rem] p-1 border border-gray-100/50 mb-12">
                    <SeasonForm
                        program_id={programId}
                        schoolId={schoolId}
                        suggestedYear={nextSuggestedYear}
                        onSuccess={() => {
                            setIsAddOpen(false)
                            if (onRefresh) {
                                onRefresh()
                            } else {
                                router.refresh()
                            }
                        }}
                    />
                </div>
            )}

            {isEditOpen && selectedSeasonForEdit && (
                <SeasonEditModal
                    onClose={() => setIsEditOpen(false)}
                    season={selectedSeasonForEdit}
                    schoolId={schoolId}
                    onSuccess={() => {
                        setIsEditOpen(false)
                        if (onRefresh) {
                            onRefresh()
                        } else {
                            router.refresh()
                        }
                    }}
                />
            )}

            <div className="grid grid-cols-1 gap-6">
                {seasons.map((season) => {
                    const playerCount = Array.isArray(season.roster) ? season.roster.length : 0

                    return (
                        <div key={season.id} className="glass-card p-4 rounded-[1.5rem] border-none shadow-soft group hover:translate-y-[-2px] transition-all duration-300">
                            <div className="flex items-center gap-5">
                                {/* Season Image Preview */}
                                <div className="w-20 h-20 rounded-2xl bg-black border border-gray-100 overflow-hidden flex-shrink-0 relative group-hover:border-black/10 transition-colors">
                                    {(season as any).photo_url ? (
                                        isVideoUrl((season as any).photo_url) ? (
                                            <video
                                                src={(season as any).photo_url}
                                                className="w-full h-full object-cover"
                                                muted
                                                autoPlay
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img src={(season as any).photo_url} className="w-full h-full object-cover" alt="" />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                                            <Users size={24} />
                                        </div>
                                    )}
                                    {isVideoUrl((season as any).photo_url) && (
                                        <div className="absolute bottom-1 right-1 p-1 bg-black/40 backdrop-blur-md rounded-full text-white/80">
                                            <Film size={8} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                                            {season.year} Season
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenRoster(season)}
                                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Users size={14} />
                                                Manage Roster
                                            </button>
                                            <button
                                                onClick={() => handleOpenEdit(season)}
                                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit size={14} />
                                                Edit Details
                                            </button>
                                            <div className="ml-1 pl-3 border-l border-gray-100">
                                                <DeleteButton id={season.id} programId={programId} type="season" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {playerCount} Players
                                        </p>
                                        {season.record && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 text-[8px] font-black uppercase tracking-widest rounded-md">
                                                <span>Record: {season.record}</span>
                                            </div>
                                        )}
                                    </div>

                                    {(season as any).summary && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Season Summary</span>
                                            </div>
                                            <p className="text-[11px] text-gray-600 font-medium line-clamp-2">
                                                {(season as any).summary}
                                            </p>
                                        </div>
                                    )}

                                    {(season as any).individual_accomplishments && (
                                        <div className="mt-2 p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1 h-1 rounded-full bg-emerald-300" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Individual Honors</span>
                                            </div>
                                            <p className="text-[10px] text-emerald-700 font-bold line-clamp-1 truncate">
                                                {(season as any).individual_accomplishments}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {seasons.length === 0 && !isAddOpen && (
                    <div className="bg-gray-50 rounded-[3rem] p-16 border border-dashed border-gray-200 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mb-6 shadow-sm border border-gray-100">
                            <Users size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Season History</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8 max-w-xs mx-auto">
                            This program doesn't have any historical seasons yet. Start by adding the most recent one.
                        </p>
                        <button
                            onClick={() => {
                                setIsAddOpen(true)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="flex items-center gap-3 px-10 py-4 bg-black text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-2xl active:scale-95"
                        >
                            <Plus size={18} strokeWidth={3} />
                            Add Your First Season
                        </button>
                    </div>
                )}
            </div>

            {isRosterOpen && selectedSeasonForRoster && (
                <RosterModal
                    seasonId={selectedSeasonForRoster.id}
                    programId={programId}
                    programName={programName}
                    seasonYear={selectedSeasonForRoster.year}
                    initialRoster={selectedSeasonForRoster.roster}
                    onClose={() => setIsRosterOpen(false)}
                />
            )}

            {isEditOpen && selectedSeasonForEdit && (
                <SeasonEditModal
                    season={selectedSeasonForEdit}
                    schoolId={schoolId}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    )
}

