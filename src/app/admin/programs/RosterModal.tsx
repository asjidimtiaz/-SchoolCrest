'use client'

import { X } from 'lucide-react'
import RosterManager from './RosterManager'

interface RosterModalProps {
    seasonId: string
    programId: string
    initialRoster: any
    onClose: () => void
    seasonYear: number
    programName: string
}

export default function RosterModal({
    seasonId,
    programId,
    initialRoster,
    onClose,
    seasonYear,
    programName
}: RosterModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in text-left">
            <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Program Roster</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 px-0.5">
                            {seasonYear} — {programName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <RosterManager
                        seasonId={seasonId}
                        programId={programId}
                        initialRoster={initialRoster}
                        seasonYear={seasonYear}
                        programName={programName}
                        onFinish={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
