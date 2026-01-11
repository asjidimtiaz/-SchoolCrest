'use client'

import { TeamSeason } from '@/lib/getTeams'
import { X, Calendar, Trophy, User, Save } from 'lucide-react'
import SeasonForm from './SeasonForm'

interface SeasonEditModalProps {
    season: TeamSeason
    schoolId: string
    onClose: () => void
}

export default function SeasonEditModal({ season, schoolId, onClose }: SeasonEditModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in text-left">
            <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                            <Trophy size={18} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Edit Season</h2>
                            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mt-2 px-0.5">
                                {season.year} Historical Record
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Section */}
                <div className="px-8 py-6">
                    <SeasonForm 
                        team_id={season.team_id} 
                        schoolId={schoolId}
                        season={season} 
                        onSuccess={onClose}
                    />
                </div>
                
                <div className="p-8 pt-0">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-gray-50 text-gray-400 font-black rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] border border-gray-100"
                    >
                        Discard Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
