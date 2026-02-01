'use client'

import { ProgramSeason } from '@/lib/getPrograms'
import { X, Trophy } from 'lucide-react'
import SeasonForm from './SeasonForm'

interface SeasonEditModalProps {
    season: ProgramSeason
    schoolId: string
    onClose: () => void
}

export default function SeasonEditModal({ season, schoolId, onClose }: SeasonEditModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] animate-fade-in text-left">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-10 pb-2 flex items-center justify-between relative">
                    <div className="flex items-center gap-5">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${schoolId ? '#000' : '#444'} 0%, #000 100%)`
                            }}
                        >
                            <Trophy size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Edit Season Entry</h2>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 px-0.5">
                                Refine the archival record for current year history
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all active:scale-90"
                    >
                        <X size={32} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form Section */}
                <div className="px-10 py-8 overflow-y-auto custom-scrollbar">
                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100/50">
                        <SeasonForm
                            program_id={season.team_id}
                            schoolId={schoolId}
                            season={season}
                            onSuccess={onClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
