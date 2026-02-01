'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit, Trash2, UserPlus, Save, CheckCircle2 } from 'lucide-react'
import { updateRoster } from './actions'

interface Player {
    id: string
    name: string
    position: string
    grade: string
    jersey_number: string
}

interface RosterManagerProps {
    seasonId?: string
    programId?: string
    initialRoster: any
    seasonYear: number
    programName: string
    onFinish?: () => void
    onChange?: (roster: Player[]) => void
    isInline?: boolean
    hideHeader?: boolean
}

export default function RosterManager({
    seasonId,
    programId,
    initialRoster,
    seasonYear,
    programName,
    onFinish,
    onChange,
    isInline = false,
    hideHeader = false
}: RosterManagerProps) {
    // Defensive initialization: ensure roster is always a valid array of Player objects
    const [roster, setRoster] = useState<Player[]>(() => {
        if (!Array.isArray(initialRoster)) {
            return [];
        }
        return initialRoster.filter((item: any) => {
            if (!item || typeof item !== 'object') return false;
            if (!item.id || !item.name) return false;
            return true;
        });
    })
    const [isPending, startTransition] = useTransition()
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        grade: '',
        jersey_number: ''
    })

    const handleSaveRoster = async (newRoster: Player[]) => {
        if (onChange) {
            onChange(newRoster)
            return
        }

        if (!seasonId || !programId) return

        startTransition(async () => {
            await updateRoster(seasonId, programId, newRoster)
        })
    }

    const addPlayer = () => {
        if (!formData.name) return

        const newPlayer: Player = {
            id: editingPlayer?.id || Math.random().toString(36).substr(2, 9),
            ...formData
        }

        let newRoster: Player[]
        if (editingPlayer) {
            newRoster = roster.map(p => p.id === editingPlayer.id ? newPlayer : p)
        } else {
            newRoster = [...roster, newPlayer]
        }

        setRoster(newRoster)
        handleSaveRoster(newRoster)
        setEditingPlayer(null)
        setFormData({ name: '', position: '', grade: '', jersey_number: '' })
    }

    const deletePlayer = (id: string) => {
        if (!confirm('Remove player from roster?')) return
        const newRoster = roster.filter(p => p.id !== id)
        setRoster(newRoster)
        handleSaveRoster(newRoster)
    }

    const startEdit = (player: Player) => {
        setEditingPlayer(player)
        setFormData({
            name: player.name,
            position: player.position,
            grade: player.grade,
            jersey_number: player.jersey_number
        })
    }

    return (
        <div className={`flex flex-col ${isInline ? '' : 'h-full'}`}>
            {/* Header Content (only if inline and needs context) */}
            {isInline && !hideHeader && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full border border-blue-100">Step 2 of 2</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Build the Roster</h2>
                    <p className="text-sm text-gray-500 font-medium">Add players to the {seasonYear} roster for {programName}.</p>
                </div>
            )}

            {/* Form Section - Clean institutional style */}
            <div className={`space-y-4 ${isInline ? 'bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 mb-6 shadow-inner' : 'px-8 py-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-white border-2 border-transparent focus:border-black rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-bold text-sm shadow-sm"
                            placeholder="Player Name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Position</label>
                        <input
                            value={formData.position}
                            onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full bg-white border-2 border-transparent focus:border-black rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-bold text-sm shadow-sm"
                            placeholder="e.g. Quarterback"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grade</label>
                        <input
                            value={formData.grade}
                            onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                            className="w-full bg-white border-2 border-transparent focus:border-black rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-bold text-sm shadow-sm"
                            placeholder="Junior"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jersey #</label>
                        <input
                            value={formData.jersey_number}
                            onChange={e => setFormData(prev => ({ ...prev, jersey_number: e.target.value }))}
                            className="w-full bg-white border-2 border-transparent focus:border-black rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-300 outline-none transition-all font-bold text-sm shadow-sm"
                            placeholder="#12"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={addPlayer}
                    className="w-full py-4 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px]"
                >
                    {editingPlayer ? <Edit size={14} strokeWidth={3} /> : <UserPlus size={14} strokeWidth={3} />}
                    {editingPlayer ? 'Update Player' : 'Add to Roster'}
                </button>
            </div>

            {/* List Section - Refined Feed style */}
            <div className={`flex-1 overflow-y-auto space-y-3 ${isInline ? 'max-h-[500px] pr-2' : 'px-8 py-4 pb-8'}`}>
                {!isInline && <div className="h-px bg-gray-100 w-full mb-6" />}

                {roster.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-[1.5rem] border-2 border-dashed border-gray-100">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                            <Plus size={16} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">No players added yet.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-2">
                    {roster.map((player) => (
                        <div key={player.id} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-black hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors">
                                    <span className="text-[9px] font-black text-gray-400 group-hover:text-white uppercase">
                                        {player.jersey_number ? String(player.jersey_number).replace('#', '') : '#'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-gray-900 font-black text-sm leading-tight tracking-tight uppercase">{player.name ? String(player.name) : 'Unknown Player'}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{player.position || '---'}</span>
                                        <div className="w-0.5 h-0.5 rounded-full bg-gray-200" />
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{player.grade || '---'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    type="button"
                                    onClick={() => startEdit(player)}
                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deletePlayer(player.id)}
                                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            {onFinish && (
                <div className={`pt-8 ${isInline ? '' : 'px-8 pb-8 border-t border-gray-100'}`}>
                    <button
                        type="button"
                        onClick={onFinish}
                        className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <CheckCircle2 size={18} />
                        Complete Selection
                    </button>
                </div>
            )}
        </div>
    )
}
