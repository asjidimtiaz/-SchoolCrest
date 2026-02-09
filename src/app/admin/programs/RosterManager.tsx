'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Edit, Trash2, UserPlus, Save, CheckCircle2, Upload, FileText, X } from 'lucide-react'
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
    const [showBulkAdd, setShowBulkAdd] = useState(false)
    const [bulkText, setBulkText] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
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

    const parseCSVLine = (line: string): string[] => {
        // Handle both comma and tab-separated values
        const separator = line.includes('\t') ? '\t' : ','
        return line.split(separator).map(field => field.trim())
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            processBulkData(text)
        }
        reader.readAsText(file)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const processBulkData = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim())

        // Skip header if it looks like one (contains "name" or "player")
        let startIndex = 0
        if (lines[0] && (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('player'))) {
            startIndex = 1
        }

        const newPlayers: Player[] = []
        for (let i = startIndex; i < lines.length; i++) {
            const fields = parseCSVLine(lines[i])
            const name = fields[0]?.trim()

            if (!name) continue // Skip empty names

            newPlayers.push({
                id: Math.random().toString(36).substr(2, 9),
                name: name,
                position: fields[1]?.trim() || '',
                grade: fields[2]?.trim() || '',
                jersey_number: fields[3]?.trim() || ''
            })
        }

        if (newPlayers.length > 0) {
            const newRoster = [...roster, ...newPlayers]
            setRoster(newRoster)
            handleSaveRoster(newRoster)
            setBulkText('')
            setShowBulkAdd(false)
        }
    }

    const handleBulkAdd = () => {
        if (!bulkText.trim()) return
        processBulkData(bulkText)
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

            {/* Bulk Import Section */}
            <div className={`space-y-3 ${isInline ? 'mb-4' : 'px-8 pt-4'}`}>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <Upload size={14} strokeWidth={3} />
                        Import CSV
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowBulkAdd(!showBulkAdd)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <FileText size={14} strokeWidth={3} />
                        {showBulkAdd ? 'Cancel Bulk Add' : 'Bulk Add'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {showBulkAdd && (
                    <div className="animate-slide-up bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                        <div className="space-y-2 mb-3">
                            <label className="text-[10px] font-black text-purple-700 uppercase tracking-widest">
                                Paste Player Data
                            </label>
                            <p className="text-[9px] text-purple-600 font-medium">
                                Format: Name, Position, Grade, Jersey# (one player per line, comma or tab-separated)
                            </p>
                        </div>
                        <textarea
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            rows={6}
                            className="w-full bg-white border-2 border-purple-200 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 placeholder:text-purple-300 outline-none transition-all resize-none"
                            placeholder="John Doe, Quarterback, Senior, 12&#10;Jane Smith, Running Back, Junior, 24&#10;..."
                        />
                        <div className="flex items-center justify-end gap-2 mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setBulkText('')
                                    setShowBulkAdd(false)
                                }}
                                className="px-4 py-2 text-purple-600 hover:text-purple-800 font-black text-[9px] uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkAdd}
                                disabled={!bulkText.trim()}
                                className="px-6 py-2 bg-purple-600 text-white font-black rounded-lg hover:bg-purple-700 transition-all text-[9px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add All Players
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
