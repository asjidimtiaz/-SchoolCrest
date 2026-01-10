'use client'

import { useActionState, useEffect, useState } from 'react'
import { createTeam, updateTeam } from './actions'
import { useRouter } from 'next/navigation'
import { Team } from '@/lib/getTeams'
import { Save, Users, ChevronRight, User, Film, Plus, ArrowRight } from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import RosterManager from './RosterManager'

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

  // Live Preview State
  const [formData, setFormData] = useState({
    name: team?.name || '',
    gender: team?.gender || 'Boys',
    // Default category to Varsity if not present, but we won't show it
    sport_category: team?.sport_category || 'Varsity',
    head_coach: team?.head_coach || '',
    photo_url: team?.photo_url || '',
    media_type: team?.media_type || 'image' as 'image' | 'video',
    
    // New Season Fields (for Creation)
    season_year: new Date().getFullYear().toString(),
    wc_state: false,
    wc_region: false,
    wc_individual: false,
    individual_accomplishments: ''
  })

  useEffect(() => {
    if (state?.success) {
      if (isEdit) {
        router.push('/admin/teams')
      } else if ((state as any).teamId && (state as any).seasonId) {
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

  if (step === 2 && createdData) {
      return (
          <div className="flex flex-col xl:flex-row gap-8 pb-10 text-left">
              <div className="flex-1">
                  <RosterManager 
                    seasonId={createdData.seasonId}
                    teamId={createdData.teamId}
                    teamName={createdData.teamName}
                    seasonYear={createdData.seasonYear}
                    initialRoster={[]}
                    isInline={true}
                    onFinish={() => router.push('/admin/teams')}
                  />
              </div>

              {/* Keep Preview for continuity */}
              <div className="xl:w-64 space-y-4 sticky top-8 opacity-50">
                <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Program Created</h2>
                <div className="glass-card rounded-[2rem] border-none overflow-hidden p-6 flex flex-col items-center text-center shadow-soft">
                    <div className="w-full aspect-video rounded-2xl bg-gray-50 border border-gray-100 shadow-inner overflow-hidden mb-4 flex items-center justify-center text-gray-200 relative">
                        {formData.photo_url ? (
                            formData.media_type === 'video' ? (
                                <video src={formData.photo_url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            ) : (
                                <img src={formData.photo_url} alt="" className="w-full h-full object-cover" />
                            )
                        ) : (
                            <Users size={32} />
                        )}
                    </div>
                    <div>
                        <h3 className="text-base font-black text-gray-900 leading-tight truncate">{formData.name}</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1">{formData.gender} Athletics</p>
                    </div>
                </div>
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10 text-left">
      <form action={formAction} className="flex-1 space-y-6">
        <input type="hidden" name="school_id" value={schoolId} />
        {isEdit && <input type="hidden" name="id" value={team?.id} />}
        <input type="hidden" name="media_type" value={formData.media_type} />
        {/* Force 'Varsity' if creating new, or keep existing for edits */}
        <input type="hidden" name="sport_category" value={formData.sport_category} />

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
                
                {/* Year Input - Only show for NEW teams (initial season) */}
                {!isEdit && (
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Season Year</label>
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

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Head Coach</label>
                <input
                    name="head_coach"
                    value={formData.head_coach}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                    placeholder="e.g. Coach Carter"
                />
            </div>

            {/* Championship Toggles (Only for New Team creation flow) */}
            {!isEdit && (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Championships Won This Season</label>
                    <div className="flex flex-wrap gap-4">
                        {['State', 'Region', 'Individual'].map((type) => (
                             <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                    formData[`wc_${type.toLowerCase()}` as keyof typeof formData] 
                                    ? 'bg-black border-black text-white' 
                                    : 'bg-white border-gray-200 group-hover:border-gray-300 text-transparent'
                                }`}>
                                    <input 
                                        type="checkbox" 
                                        name={`wc_${type.toLowerCase()}`}
                                        checked={!!formData[`wc_${type.toLowerCase()}` as keyof typeof formData]}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="transform scale-90">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className="text-xs font-bold text-gray-700 select-none">{type}</span>
                            </label>
                        ))}
                    </div>

                    {/* Individual Details */}
                    {formData.wc_individual && (
                         <div className="space-y-1.5 animate-slide-up">
                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Individual Names & Events (One per line)</label>
                            <textarea
                                name="individual_accomplishments"
                                value={formData.individual_accomplishments}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-medium text-sm shadow-soft resize-none"
                                placeholder="John Doe - 100m Dash&#10;Jane Smith - High Jump"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4 pt-2">
                 <MediaUpload 
                    name="photo_file"
                    label="Program Hero Media"
                    description="Upload a team photo or highlight video"
                    currentMediaUrl={formData.photo_url}
                    currentMediaType={formData.media_type}
                    onMediaChange={(url, type) => setFormData(prev => ({ ...prev, photo_url: url || '', media_type: type }))}
                 />
                 <input type="hidden" name="existing_photo_url" value={formData.photo_url || ''} />
            </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100 animate-slide-up">
            {state.error}
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
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 text-[11px] uppercase tracking-widest"
            >
                {isPending ? <Plus className="animate-spin" size={14} /> : isEdit ? <Save size={14} /> : <ArrowRight size={14} />}
                {isPending ? 'Processing...' : isEdit ? 'Update Program' : 'Next: Manage Roster'}
            </button>
        </div>
      </form>

      {/* 🔮 Preview Side-bar */}
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

                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="px-3 py-0.5 bg-gray-50 text-[8px] font-black uppercase tracking-widest rounded-full text-gray-500 border border-gray-100">
                        {isEdit ? (formData.sport_category || 'Year') : (formData.season_year || 'Year')}
                    </span>
                    {formData.head_coach && (
                        <span className="text-[8px] font-bold text-gray-400 truncate max-w-[100px]">
                            {formData.head_coach}
                        </span>
                    )}
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
