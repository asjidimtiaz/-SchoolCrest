'use client'

import { useActionState, useEffect, useState } from 'react'
import { upsertSeason } from './actions'
import { TeamSeason } from '@/lib/getTeams'
import MediaUpload from '@/components/MediaUpload'
import RosterManager from './RosterManager'
import { supabaseClient } from '@/lib/supabaseClient'

interface SeasonFormProps {
    team_id: string
    schoolId?: string
    season?: TeamSeason // For editing
    suggestedYear?: number
    onSuccess?: () => void
}

// Define Player interface to match RosterManager
interface Player {
    id: string
    name: string
    position: string
    grade: string
    jersey_number: string
}

const initialState = { error: '', success: false }

export default function SeasonForm({ team_id, schoolId, season, suggestedYear, onSuccess }: SeasonFormProps) {
    const [uploading, setUploading] = useState(false)
    const [customError, setCustomError] = useState('')
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState((season as any)?.photo_url || '')
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(upsertSeason, initialState)

    const [achievements, setAchievements] = useState<string[]>(season?.achievements || [])
    
    // Manage Roster State
    const [roster, setRoster] = useState<Player[]>(() => {
        if (!season?.roster) return [];
        if (typeof season.roster === 'string') {
            try { return JSON.parse(season.roster); } catch(e) { return []; }
        }
        return Array.isArray(season.roster) ? season.roster : [];
    });

    const toggleAchievement = (ach: string) => {
        setAchievements(prev => 
            prev.includes(ach) ? prev.filter(a => a !== ach) : [...prev, ach]
        )
    }

    useEffect(() => {
        if (state?.success) {
            onSuccess?.()
            if (!season) {
                const form = document.querySelector('form') as HTMLFormElement
                form?.reset()
                setAchievements([])
                setRoster([])
            }
        }
    }, [state?.success, season, onSuccess])


    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="team_id" value={team_id} />
            {season && <input type="hidden" name="id" value={season.id} />}
            <input type="hidden" name="existing_photo_url" value={currentPhotoUrl} />

            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-1">
                <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-black rounded-full" />
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Archive entry</span>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                            {season ? 'Update Season Record' : 'Create Historical Entry'}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {/* 1. Media Section - Integrated & Compact */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Season Team Photo</label>
                    </div>
                    <MediaUpload 
                        name="photo_file_input"
                        label=""
                        currentMediaUrl={currentPhotoUrl}
                        className="!aspect-video shadow-soft !rounded-[2rem] border-0 bg-gray-50/50 !p-0 !mb-0 hover:scale-100"
                        onFileSelect={async (file) => {
                            if (!file) return;
                            setUploading(true);
                            setCustomError('');
                            try {
                                const uploadFormData = new FormData();
                                uploadFormData.append('file', file);
                                uploadFormData.append('schoolId', schoolId || '');
                                uploadFormData.append('folder', 'seasons');
                                
                                const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: uploadFormData
                                });
                                
                                if (!res.ok) throw new Error('Upload failed');
                                
                                const { url } = await res.json();
                                setCurrentPhotoUrl(url);
                            } catch (err: any) {
                                setCustomError("Upload failed: " + err.message);
                            } finally {
                                setUploading(false);
                            }
                        }}
                    />
                </div>

                {/* 2. Meta Info Section - Clean Institutional Style */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-soft space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Season Statistics</label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <div className="md:col-span-1 lg:col-span-1 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Year</label>
                            <input 
                                name="year"
                                type="number"
                                defaultValue={season?.year || suggestedYear || new Date().getFullYear()}
                                required
                                className="w-full px-4 py-3 bg-gray-50/50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none text-base font-black text-gray-900 transition-all shadow-sm text-center"
                                placeholder="2024"
                            />
                        </div>

                        <div className="md:col-span-1 lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Record Highlights</label>
                            <input 
                                name="record"
                                defaultValue={season?.record}
                                className="w-full px-6 py-3 bg-gray-50/50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none text-sm font-bold text-gray-700 transition-all shadow-sm"
                                placeholder="e.g. 12-4 Overall"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Head Coach</label>
                            <input 
                                name="coach"
                                defaultValue={season?.coach || ''}
                                className="w-full px-6 py-3 bg-gray-50/50 border-2 border-transparent focus:border-black focus:bg-white rounded-xl outline-none text-sm font-black text-gray-900 transition-all shadow-sm"
                                placeholder="e.g. Coach Carter"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Narrative Section - Grouped with smooth transitions */}
                <div className="bg-gray-50/40 p-6 rounded-[2.5rem] border border-gray-100 shadow-soft space-y-5">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Season Achievements</label>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Season Summary</label>
                            <textarea 
                                name="summary"
                                defaultValue={(season as any)?.summary}
                                rows={3}
                                className="w-full px-6 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none text-sm font-medium text-gray-600 transition-all resize-none shadow-sm leading-relaxed"
                                placeholder="Tell the story of this season..."
                            />
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            {/* Championships Selection - "Chips Style" */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titles Won</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'State Champions', label: 'State' },
                                        { id: 'Region Champions', label: 'Region' },
                                        { id: 'Individual Honors', label: 'Individual' }
                                    ].map(({ id, label }) => (
                                        <button 
                                            key={id}
                                            type="button"
                                            onClick={() => toggleAchievement(id)}
                                            className={`px-5 py-2.5 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${
                                                achievements.includes(id) 
                                                ? 'bg-black border-black text-white shadow-lg active:scale-95' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-black/5 hover:text-gray-600'
                                            }`}
                                        >
                                            <div className={`w-1 h-1 rounded-full ${achievements.includes(id) ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {achievements.includes('Individual Honors') && (
                        <div className="space-y-2 animate-slide-up pt-2">
                            <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Names and Honors Won</label>
                            <textarea 
                                name="individual_accomplishments"
                                defaultValue={(season as any)?.individual_accomplishments}
                                rows={2}
                                className="w-full px-6 py-3 bg-white border border-rose-50 rounded-xl focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 outline-none text-sm font-medium text-gray-700 transition-all resize-none shadow-sm"
                                placeholder="John Doe - 100m Dash"
                            />
                        </div>
                    )}
                </div>

                {/* 4. Roster Section - Integrated Seamlessly */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-soft space-y-5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Team Roster</label>
                    </div>

                    <div className="px-1">
                        <RosterManager 
                            initialRoster={roster}
                            onChange={(newRoster) => setRoster(newRoster)}
                            seasonYear={season?.year || suggestedYear || 0}
                            teamName=""
                            isInline={true}
                            hideHeader={true}
                        />
                    </div>
                </div>
            </div>

            {/* Hidden fields to maintain compatibility with existing schema */}
            <input type="hidden" name="achievements" value={achievements.join('\n')} />
            <input type="hidden" name="roster" value={JSON.stringify(roster)} />

            {(state?.error || customError) && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100 animate-slide-up flex items-center gap-3 shadow-sm mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {state?.error || customError}
                </div>
            )}

            <div className="flex items-center justify-end gap-6 pt-8 mt-4 border-t border-gray-100/60">
                <button 
                    type="button"
                    onClick={onSuccess}
                    className="px-6 py-2.5 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px] hover:text-black transition-colors"
                >
                    Discard Changes
                </button>
                <button 
                    type="submit"
                    disabled={isPending || uploading}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 uppercase tracking-[0.2em] text-[10px]"
                >
                    {isPending ? 'Processing...' : 'Save archive'}
                </button>
            </div>
        </form>
    )
}
