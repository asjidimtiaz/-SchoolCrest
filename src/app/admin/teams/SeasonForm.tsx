'use client'

import { useActionState, useEffect, useState } from 'react'
import { upsertSeason } from './actions'
import { TeamSeason } from '@/lib/getTeams'
import MediaUpload from '@/components/MediaUpload'
import { supabaseClient } from '@/lib/supabaseClient'

interface SeasonFormProps {
    team_id: string
    schoolId?: string
    season?: TeamSeason // For editing
    onSuccess?: () => void
}

const initialState = { error: '', success: false }

export default function SeasonForm({ team_id, schoolId, season, onSuccess }: SeasonFormProps) {
    const [uploading, setUploading] = useState(false)
    const [customError, setCustomError] = useState('')
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState((season as any)?.photo_url || '')
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Season Year</label>
                <input 
                    name="year"
                    type="number"
                    defaultValue={season?.year || new Date().getFullYear()}
                    required
                    className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-[1.25rem] focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all shadow-soft"
                    placeholder="2024"
                />
            </div>

            <div className="space-y-4">
                <MediaUpload 
                    name="photo_file_input"
                    label="Season Photo"
                    description="Upload an image for this specific season"
                    currentMediaUrl={currentPhotoUrl}
                    className="!aspect-video h-44"
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
                            
                            if (!res.ok) {
                                const errData = await res.json();
                                throw new Error(errData.error || 'Upload failed');
                            }
                            
                            const { url } = await res.json();
                            setCurrentPhotoUrl(url);
                        } catch (err: any) {
                            setCustomError("Upload failed: " + err.message);
                        } finally {
                            setUploading(false);
                        }
                    }}
                />
                <input type="hidden" name="existing_photo_url" value={currentPhotoUrl} />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Yearly Summary / Highlights</label>
                <textarea 
                    name="summary"
                    defaultValue={(season as any)?.summary}
                    rows={4}
                    className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-[1.25rem] focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all resize-none shadow-soft"
                    placeholder="Provide a detailed summary of the season, major highlights, and team journey..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Record Highlights</label>
                <textarea 
                    name="record"
                    defaultValue={season?.record}
                    rows={2}
                    className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-[1.25rem] focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all resize-none shadow-soft"
                    placeholder="e.g. 12-4 Overall • 8-0 in Region"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Individual Championships / Honors</label>
                <textarea 
                    name="individual_accomplishments"
                    defaultValue={(season as any)?.individual_accomplishments}
                    rows={3}
                    className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-[1.25rem] focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all resize-none shadow-soft"
                    placeholder="e.g. John Doe - State Champion (100m Dash)"
                />
            </div>

            {/* Hidden fields for coach and achievements to maintain compatibility with existing schema */}
            <input type="hidden" name="coach" value={season?.coach || ''} />
            <input type="hidden" name="achievements" value={Array.isArray(season?.achievements) ? season.achievements.join('\n') : ''} />
            <input type="hidden" name="roster" value={typeof season?.roster === 'object' ? JSON.stringify(season.roster) : (season?.roster || '[]')} />

            {(state?.error || customError) && (
                <p className="text-xs font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{state?.error || customError}</p>
            )}

            <button
                type="submit"
                disabled={isPending || uploading}
                className="w-full py-4 bg-black text-white font-black rounded-[1.25rem] hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 text-[11px] uppercase tracking-widest shadow-xl"
            >
                {uploading ? 'Uploading Media...' : isPending ? 'Saving...' : season ? 'Update Season Details' : 'Add Season to History'}
            </button>
        </form>

    )
}
