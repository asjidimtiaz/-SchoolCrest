'use client'

import { useState } from 'react'
import { TeamSeason } from '@/lib/getTeams'
import { Edit, Trash2, Users } from 'lucide-react'
import DeleteButton from './DeleteButton'
import RosterModal from './RosterModal'
import SeasonEditModal from './SeasonEditModal'

interface SeasonsManagerProps {
    seasons: TeamSeason[]
    teamId: string
    teamName: string
}

export default function SeasonsManager({ seasons, teamId, teamName }: SeasonsManagerProps) {
    const [selectedSeasonForRoster, setSelectedSeasonForRoster] = useState<TeamSeason | null>(null)
    const [selectedSeasonForEdit, setSelectedSeasonForEdit] = useState<TeamSeason | null>(null)
    const [isRosterOpen, setIsRosterOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleOpenRoster = (season: TeamSeason) => {
        setSelectedSeasonForRoster(season)
        setIsRosterOpen(true)
    }

    const handleOpenEdit = (season: TeamSeason) => {
        setSelectedSeasonForEdit(season)
        setIsEditOpen(true)
    }

    return (
        <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 gap-6">
                {seasons.map((season) => {
                    const playerCount = Array.isArray(season.roster) ? season.roster.length : 0
                    
                    return (
                        <div key={season.id} className="glass-card p-6 rounded-[1.5rem] border-none shadow-soft group hover:translate-y-[-2px] transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                                        {season.year} Season
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        {playerCount} Players on Roster
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleOpenRoster(season)}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                                    >
                                        Roster
                                    </button>
                                    <button 
                                        onClick={() => handleOpenEdit(season)}
                                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <DeleteButton id={season.id} teamId={teamId} type="season" />
                                </div>
                            </div>
                            
                            {season.record && (
                                <div className="pt-4 border-t border-gray-50 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-md">Record</span>
                                    <p className="text-sm text-gray-900 font-bold">
                                        {season.record}
                                    </p>
                                </div>
                            )}
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
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    )
}

