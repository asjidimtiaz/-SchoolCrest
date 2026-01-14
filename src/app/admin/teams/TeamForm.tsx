'use client'

import { useActionState, useEffect, useState } from 'react'
import { createTeam, updateTeam } from './actions'
import { useRouter } from 'next/navigation'
import { Team } from '@/lib/getTeams'
import { Save, Users, ChevronRight, User, Film, Plus, ArrowRight } from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import RosterManager from './RosterManager'
import SeasonsManager from './SeasonsManager'
import { supabaseClient } from '@/lib/supabaseClient'

interface TeamFormProps {
  team?: Team
  schoolId: string
  isEdit?: boolean
}

const initialState = { error: '', success: false }

export default function TeamForm({ team, schoolId, isEdit = false }: TeamFormProps) {
  const router = useRouter()

  // @ts-ignore
  const [state, formAction, isPending] = useActionState(isEdit ? updateTeam : createTeam, initialState as any)
  const [step, setStep] = useState<1 | 2>(1)
  const [createdData, setCreatedData] = useState<{ teamId: string, seasonId: string, teamName: string, seasonYear: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [customError, setCustomError] = useState('')

  // Live Preview State
  const [formData, setFormData] = useState({
    name: team?.name || '',
    gender: team?.gender || 'Boys',
    sport_category: team?.sport_category || '',
    photo_url: team?.photo_url || '',
    background_url: team?.background_url || '',
    media_type: team?.media_type || 'image' as 'image' | 'video',
    
    // New Season Fields (for Creation)
    season_year: new Date().getFullYear().toString(),
    season_photo_url: '',
    wc_state: false,
    wc_region: false,
    wc_individual: false,
    individual_accomplishments: '',
    summary: '',
    roster: [] as any[]
  })

  const [seasons, setSeasons] = useState<any[]>([])
  const [loadingSeasons, setLoadingSeasons] = useState(false)

  // Fetch seasons for Step 2
  useEffect(() => {
    async function fetchSeasons() {
      if (step === 2 && createdData?.teamId) {
        setLoadingSeasons(true)
        const { data, error } = await supabaseClient
          .from('team_seasons')
          .select('*')
          .eq('team_id', createdData.teamId)
          .order('year', { ascending: false })
        
        if (!error && data) {
          setSeasons(data)
        }
        setLoadingSeasons(false)
      }
    }
    fetchSeasons()
  }, [step, createdData?.teamId])

  useEffect(() => {
    if (state?.success) {
      if (isEdit) {
        router.push('/admin/teams')
      } else if ((state as any).teamId) {
        setCreatedData({
            teamId: (state as any).teamId,
            seasonId: (state as any).seasonId,
            teamName: (state as any).teamName,
            seasonYear: (state as any).seasonYear
        })
        setStep(2)
      } else {
        router.push('/admin/teams')
      }
    }
  }, [state?.success, isEdit, state, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle Step 2 Success (Legacy/Final)
  useEffect(() => {
    if (state?.success && isEdit) {
      router.push('/admin/teams')
    }
  }, [state?.success, isEdit, router])

  const nextStep = () => setStep(2)
  const prevStep = () => setStep(1)

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10 text-left">
        {step === 1 ? (
            <form action={formAction} className="flex-1 space-y-6">
                <input type="hidden" name="school_id" value={schoolId} />
                {isEdit && <input type="hidden" name="id" value={team?.id} />}
                <input type="hidden" name="media_type" value={formData.media_type} />
                <input type="hidden" name="sport_category" value={formData.sport_category || 'Athletics'} />
                <input type="hidden" name="roster" value={JSON.stringify(formData.roster)} />
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="glass-card p-6 rounded-2xl border-none space-y-5">
                    {!isEdit && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full border border-blue-100">Step 1 of 2</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                    )}
                    
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Program Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                            placeholder="e.g. Basketball"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft appearance-none cursor-pointer"
                                >
                                    <option value="Boys">Boys</option>
                                    <option value="Girls">Girls</option>
                                    <option value="Co-ed">Co-ed</option>
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 rotate-90 pointer-events-none" size={14} />
                            </div>
                        </div>
                        
                        {!isEdit && (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Inaugural Season Year</label>
                                <input
                                    type="number"
                                    name="season_year"
                                    value={formData.season_year}
                                    onChange={handleChange}
                                    required
                                    min="1900"
                                    max="2100"
                                    className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                                    placeholder="2026"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-8">
                        {/* 1. Card Photo Upload */}
                        <MediaUpload 
                            name="photo_file_input"
                            label="Program Card Photo"
                            description="This image appears on the main team selection card (vertical)."
                            recommendation="Recommended ratio: 3:4 (Portrait)"
                            currentMediaUrl={formData.photo_url}
                            onFileSelect={async (file) => {
                                if (!file) return;
                                setUploading(true);
                                setCustomError('');
                                try {
                                    const uploadFormData = new FormData();
                                    uploadFormData.append('file', file);
                                    uploadFormData.append('schoolId', schoolId);
                                    uploadFormData.append('folder', 'teams');
                                    
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
                                    setFormData(prev => ({ ...prev, photo_url: url }));
                                } catch (err: any) {
                                    setCustomError("Upload failed: " + err.message);
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                        <input type="hidden" name="existing_photo_url" value={formData.photo_url || ''} />

                        {/* 2. Background Photo Upload */}
                        <MediaUpload 
                            name="background_file_input"
                            label="Program Hero Background"
                            description="This large image appears at the top of the Team Detail page."
                            recommendation="Recommended: 1920x1080px (Landscape)"
                            currentMediaUrl={formData.background_url}
                            onFileSelect={async (file) => {
                                if (!file) return;
                                setUploading(true);
                                setCustomError('');
                                try {
                                    const uploadFormData = new FormData();
                                    uploadFormData.append('file', file);
                                    uploadFormData.append('schoolId', schoolId);
                                    uploadFormData.append('folder', 'teams_bg'); // Use a relevant folder or same 'teams'
                                    
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
                                    setFormData(prev => ({ ...prev, background_url: url }));
                                } catch (err: any) {
                                    setCustomError("Upload failed: " + err.message);
                                } finally {
                                    setUploading(false);
                                }
                            }}
                        />
                        <input type="hidden" name="existing_background_url" value={formData.background_url || ''} />
                    </div>
                </div>

                {/* Integration of Roster Manager into Step 1 */}
                {/* Roster Management is now handled exclusively in Step 2 (Archive History) */}
            </div>
                {(state?.error || customError) && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100 animate-slide-up">
                    {state?.error || customError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-900 transition-colors"
                    >
                        Discard Changes
                    </button>
                    
                    <button
                        type="submit"
                        disabled={isPending || uploading || !formData.name}
                        className="flex items-center gap-2 px-8 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(0,0,0,0.15)] disabled:opacity-50 text-[11px] uppercase tracking-widest"
                    >
                        {uploading ? <Plus className="animate-spin" size={14} /> : isPending ? <Plus className="animate-spin" size={14} /> : isEdit ? <Save size={14} /> : <ArrowRight size={14} />}
                        {uploading ? 'Uploading Media...' : isPending ? 'Processing...' : isEdit ? 'Update Program' : 'Create Program & Continue'}
                    </button>
                </div>
            </form>
        ) : (
            <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-[10px] font-black uppercase tracking-widest text-emerald-600 rounded-full border border-emerald-100">Step 2 of 2</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Manage Program Archive</h2>
                    <p className="text-sm text-gray-400 font-medium">Add as many historical seasons as you want. Each season can have its own summary, achievements, and unique team photo.</p>
                </div>

                <div className="bg-gray-50/30 rounded-[2.5rem] border border-gray-100/50 p-1">
                    {createdData && (
                        <SeasonsManager 
                            seasons={seasons}
                            teamId={createdData.teamId}
                            teamName={createdData.teamName}
                            schoolId={schoolId}
                        />
                    )}
                </div>

                <div className="flex items-center justify-between p-10 bg-black text-white rounded-[2rem] shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Success</span>
                        <h3 className="text-xl font-black leading-none">{formData.name} Created</h3>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => router.push('/admin/teams')}
                        className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-3"
                    >
                        Finish & Close Wizard
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}

      <div className="xl:w-64 space-y-4 sticky top-8">
        <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Program Preview</h2>
        
        <div className="glass-card rounded-[2rem] border-none overflow-hidden p-6 flex flex-col items-center text-center shadow-soft">
            <div className="w-full aspect-video rounded-2xl bg-gray-50 border border-gray-100 shadow-inner overflow-hidden mb-4 flex items-center justify-center text-gray-200 relative group transition-all duration-500">
                {formData.photo_url ? (
                    formData.media_type === 'video' ? (
                       <video 
                           src={formData.photo_url} 
                           className="w-full h-full object-cover" 
                           muted
                           loop
                           autoPlay
                           playsInline
                       />
                    ) : (
                       <img src={formData.photo_url} alt="" className="w-full h-full object-cover" />
                    )
                ) : (
                    <Users size={32} />
                )}
                
                {formData.media_type === 'video' && formData.photo_url && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-white">
                        <Film size={12} />
                    </div>
                )}
            </div>

            <div className="space-y-3 w-full">
                <div>
                    <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                        {formData.name || 'Program Name'}
                    </h3>
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">
                        {formData.gender} Athletics
                    </p>
                </div>

                <div className="pt-3 border-t border-gray-50 flex justify-center items-center text-[10px] font-bold text-gray-400">
                    {isEdit ? 'Program' : (formData.season_year || 'Year')}
                </div>
            </div>
        </div>

        <p className="text-[8px] text-gray-400 text-center px-6 font-bold uppercase tracking-tight leading-tight">
            How the team will appear in the main athletic directory.
        </p>
      </div>
    </div>
  )
}
