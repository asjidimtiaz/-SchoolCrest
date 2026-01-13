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
    suggestedYear?: number
    onSuccess?: () => void
}

const initialState = { error: '', success: false }

export default function SeasonForm({ team_id, schoolId, season, suggestedYear, onSuccess }: SeasonFormProps) {
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
            <input type="hidden" name="existing_photo_url" value={currentPhotoUrl} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Side: Photo & Information */}
                <div className="space-y-6">
                    <MediaUpload 
                        name="photo_file_input"
                        label="Season Team Photo"
                        currentMediaUrl={currentPhotoUrl}
                        className="!aspect-video h-40 shadow-soft"
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
                                    let errorMsg = 'Upload failed';
                                    try {
                                        const errData = await res.json();
                                        errorMsg = errData.error || errorMsg;
                                    } catch (e) {
                                        console.error('Non-JSON upload error:', await res.text());
                                        errorMsg = `Upload failed (${res.status})`;
                                    }
                                    throw new Error(errorMsg);
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Year</label>
                            <input 
                                name="year"
                                type="number"
                                defaultValue={season?.year || suggestedYear || new Date().getFullYear()}
                                required
                                className="w-full px-5 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all shadow-soft"
                                placeholder="2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Record Highlights</label>
                            <input 
                                name="record"
                                defaultValue={season?.record}
                                className="w-full px-5 py-3.5 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all shadow-soft"
                                placeholder="e.g. 12-4 Overall"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Text Narrative */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Season Summary / Narrative</label>
                        <textarea 
                            name="summary"
                            defaultValue={(season as any)?.summary}
                            rows={4}
                            className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm font-bold text-slate-900 transition-all resize-none shadow-soft"
                            placeholder="Tell the story of this season..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Individual Honors</label>
                        <textarea 
                            name="individual_accomplishments"
                            defaultValue={(season as any)?.individual_accomplishments}
                            rows={3}
                            className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-[13px] font-bold text-slate-900 transition-all resize-none shadow-soft"
                            placeholder="List any individual state or regional champions..."
                        />
                    </div>
                </div>
            </div>

            {/* Hidden fields for coach and achievements to maintain compatibility with existing schema */}
            <input type="hidden" name="coach" value={season?.coach || ''} />
            <input type="hidden" name="achievements" value={Array.isArray(season?.achievements) ? season.achievements.join('\n') : ''} />
            <input type="hidden" name="roster" value={typeof season?.roster === 'object' ? JSON.stringify(season.roster) : (season?.roster || '[]')} />

            {(state?.error || customError) && (
                <p className="text-[10px] font-black text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">{state?.error || customError}</p>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={isPending || uploading}
                    className="flex items-center gap-3 px-8 py-3.5 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] shadow-xl"
                >
                    {uploading ? 'Uploading Media...' : isPending ? 'Saving Entry...' : season ? 'Update Season Entry' : 'Create Season Archive'}
                </button>
            </div>
        </form>
    )
}
