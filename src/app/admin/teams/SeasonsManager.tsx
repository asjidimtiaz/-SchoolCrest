'use client'

import { useState } from 'react'
import { TeamSeason } from '@/lib/getTeams'
import DeleteButton from './DeleteButton'
import RosterModal from './RosterModal'
import SeasonEditModal from './SeasonEditModal'
import SeasonForm from './SeasonForm'
import { Edit, Trash2, Users, Plus } from 'lucide-react'

interface SeasonsManagerProps {
    seasons: TeamSeason[]
    teamId: string
    teamName: string
    schoolId: string
}

export default function SeasonsManager({ seasons, teamId, teamName, schoolId }: SeasonsManagerProps) {
    const [selectedSeasonForRoster, setSelectedSeasonForRoster] = useState<TeamSeason | null>(null)
    const [selectedSeasonForEdit, setSelectedSeasonForEdit] = useState<TeamSeason | null>(null)
    const [isRosterOpen, setIsRosterOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    const handleOpenRoster = (season: TeamSeason) => {
        setSelectedSeasonForRoster(season)
        setIsRosterOpen(true)
    }

    const handleOpenEdit = (season: TeamSeason) => {
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
                    onClick={() => setIsAddOpen(!isAddOpen)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                        isAddOpen 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                    {isAddOpen ? <Plus className="rotate-45 transition-transform" size={14} /> : <Plus size={14} />}
                    {isAddOpen ? 'Cancel' : 'Add Season'}
                </button>
            </div>

            {isAddOpen && (
                <div className="glass-card p-10 rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white/50 animate-slide-up shadow-inner relative overflow-hidden">
                    {/* Visual Flourish */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-8 relative z-10">
                        <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">New Historical Entry</h3>
                    </div>
                    <SeasonForm 
                        team_id={teamId} 
                        schoolId={schoolId}
                        suggestedYear={nextSuggestedYear}
                        onSuccess={() => {
                            setIsAddOpen(false)
                        }} 
                    />
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {seasons.map((season) => {
                    const playerCount = Array.isArray(season.roster) ? season.roster.length : 0
                    
                    return (
                        <div key={season.id} className="glass-card p-4 rounded-[1.5rem] border-none shadow-soft group hover:translate-y-[-2px] transition-all duration-300">
                            <div className="flex items-center gap-5">
                                {/* Season Image Preview */}
                                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 relative group-hover:border-black/10 transition-colors">
                                    {(season as any).photo_url ? (
                                        <img src={(season as any).photo_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <Users size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                                            {season.year} Season
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => handleOpenRoster(season)}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                title="Manage Roster"
                                            >
                                                <Users size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEdit(season)}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                                title="Edit Details"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <DeleteButton id={season.id} teamId={teamId} type="season" />
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
                                                { (season as any).summary }
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
                                                { (season as any).individual_accomplishments }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {seasons.length === 0 && (
                    <div className="bg-gray-50 rounded-[1.5rem] p-12 border border-dashed border-gray-200 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-4 shadow-sm border border-gray-100">
                           <Users size={32} />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[11px]">No season history found</p>
                    </div>
                )}
            </div>

            {isRosterOpen && selectedSeasonForRoster && (
                <RosterModal 
                    seasonId={selectedSeasonForRoster.id}
                    teamId={teamId}
                    teamName={teamName}
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

