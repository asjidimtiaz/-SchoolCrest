'use client'

import { useState, useTransition } from 'react'
import { X, UserPlus, Edit, Trash2, Save } from 'lucide-react'
import { upsertSeason, updateRoster } from './actions'

interface Player {
    id: string
    name: string
    position: string
    grade: string
    jersey_number: string
}

import RosterManager from './RosterManager'

interface RosterModalProps {
    seasonId: string
    teamId: string
    initialRoster: any
    onClose: () => void
    seasonYear: number
    teamName: string
}

export default function RosterModal({ 
    seasonId, 
    teamId, 
    initialRoster, 
    onClose, 
    seasonYear, 
    teamName 
}: RosterModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in text-left">
            <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Team Roster</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 px-0.5">
                            {seasonYear} — {teamName}
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
                        teamId={teamId}
                        initialRoster={initialRoster}
                        seasonYear={seasonYear}
                        teamName={teamName}
                        onFinish={onClose}
                    />
                </div>
            </div>
        </div>
    )
}
