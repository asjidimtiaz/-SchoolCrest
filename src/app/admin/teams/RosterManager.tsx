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
    seasonId: string
    teamId: string
    initialRoster: any
    seasonYear: number
    teamName: string
    onFinish?: () => void
    isInline?: boolean
}

export default function RosterManager({ 
    seasonId, 
    teamId, 
    initialRoster, 
    seasonYear, 
    teamName,
    onFinish,
    isInline = false
}: RosterManagerProps) {
    // Defensive initialization: ensure roster is always a valid array of Player objects
    const [roster, setRoster] = useState<Player[]>(() => {
        if (!Array.isArray(initialRoster)) {
            console.warn('[RosterManager] initialRoster is not an array:', initialRoster);
            return [];
        }
        // Filter out any malformed items that don't have the required Player structure
        return initialRoster.filter((item: any) => {
            if (!item || typeof item !== 'object') return false;
            if (!item.id || !item.name) return false; // At minimum, must have id and name
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
        startTransition(async () => {
            await updateRoster(seasonId, teamId, newRoster)
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
            {isInline && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full border border-blue-100">Step 2 of 2</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Build the Roster</h2>
                    <p className="text-sm text-gray-500 font-medium">Add players to the {seasonYear} roster for {teamName}.</p>
                </div>
            )}

            {/* Form Section */}
            <div className={`space-y-4 ${isInline ? 'glass-card p-6 border-none mb-6' : 'px-8 py-4'}`}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Name</label>
                        <input 
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-sm shadow-soft"
                            placeholder="Player Name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Position</label>
                        <input 
                            value={formData.position}
                            onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-sm shadow-soft"
                            placeholder="e.g. Quarterback"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Grade</label>
                        <input 
                            value={formData.grade}
                            onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-sm shadow-soft"
                            placeholder="Junior"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Jersey #</label>
                        <input 
                            value={formData.jersey_number}
                            onChange={e => setFormData(prev => ({ ...prev, jersey_number: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-sm shadow-soft"
                            placeholder="#12"
                        />
                    </div>
                </div>

                <button 
                    onClick={addPlayer}
                    className="w-full py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                    {editingPlayer ? <Edit size={16} /> : <UserPlus size={16} />}
                    {editingPlayer ? 'Update Player' : 'Add Player'}
                </button>
            </div>

            {/* List Section */}
            <div className={`flex-1 overflow-y-auto space-y-3 ${isInline ? 'max-h-[400px] pr-2' : 'px-8 py-4 pb-8'}`}>
                 {!isInline && <div className="h-px bg-gray-100 w-full mb-6" />}
                 
                 {roster.length === 0 && (
                     <div className="text-center py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-100">
                         <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest">No players added yet.</p>
                     </div>
                 )}

                 {roster.map((player) => (
                     <div key={player.id} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:border-gray-900 transition-all shadow-sm">
                         <div>
                             <h4 className="text-gray-900 font-black text-base leading-tight">{player.name ? String(player.name) : 'Unknown Player'}</h4>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                 {player.position ? String(player.position) : ''} 
                                 {player.grade ? `• ${String(player.grade)}` : ''} 
                                 {player.jersey_number ? `• ${String(player.jersey_number)}` : ''}
                             </p>
                         </div>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button 
                                onClick={() => startEdit(player)}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                             >
                                 <Edit size={16} />
                             </button>
                             <button 
                                onClick={() => deletePlayer(player.id)}
                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                             >
                                 <Trash2 size={16} />
                             </button>
                         </div>
                     </div>
                 ))}
            </div>

            {/* Footer Actions */}
            {onFinish && (
                <div className={`pt-8 ${isInline ? '' : 'px-8 pb-8 border-t border-gray-100'}`}>
                    <button 
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
