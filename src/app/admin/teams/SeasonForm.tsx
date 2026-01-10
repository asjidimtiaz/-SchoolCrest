'use client'

import { useActionState, useEffect, useState } from 'react'
import { upsertSeason } from './actions'
import { TeamSeason } from '@/lib/getTeams'
import MediaUpload from '@/components/MediaUpload'

interface SeasonFormProps {
    team_id: string
    season?: TeamSeason // For editing
    onSuccess?: () => void
}

const initialState = { error: '', success: false }

export default function SeasonForm({ team_id, season, onSuccess }: SeasonFormProps) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(upsertSeason, initialState)

    useEffect(() => {
        if (state?.success) {
            onSuccess?.()
            if (!season) {
                const form = document.querySelector('form') as HTMLFormElement
                form?.reset()
            }
        }
    }, [state?.success, season, onSuccess])


    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="team_id" value={team_id} />
            {season && <input type="hidden" name="id" value={season.id} />}

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Year</label>
                <input 
                    name="year"
                    type="number"
                    defaultValue={season?.year || new Date().getFullYear()}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/50 outline-none text-sm font-bold text-white transition-all"
                    placeholder="2024"
                />
            </div>

            <div className="space-y-4">
                <MediaUpload 
                    name="photo_file"
                    label="Season Photo"
                    description="Upload an image for this specific season"
                    currentMediaUrl={(season as any)?.photo_url}
                    className="!aspect-video h-40"
                />
                <input type="hidden" name="existing_photo_url" value={(season as any)?.photo_url || ''} />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Summary</label>
                <textarea 
                    name="record"
                    defaultValue={season?.record}
                    rows={2}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/50 outline-none text-sm font-bold text-white transition-all resize-none"
                    placeholder="e.g. 12-4 • Tournament Champs"
                />
            </div>

            {/* Hidden fields for coach and achievements to maintain compatibility with existing schema */}
            <input type="hidden" name="coach" value={season?.coach || ''} />
            <input type="hidden" name="achievements" value={Array.isArray(season?.achievements) ? season.achievements.join('\n') : ''} />
            <input type="hidden" name="roster" value={typeof season?.roster === 'object' ? JSON.stringify(season.roster) : (season?.roster || '[]')} />

            {state?.error && (
                <p className="text-xs font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{state.error}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-white text-black font-black rounded-[1.25rem] hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 text-[11px] uppercase tracking-widest shadow-xl"
            >
                {isPending ? 'Saving...' : season ? 'Update Season' : 'Add Season'}
            </button>
        </form>

    )
}
