'use client'

import { useActionState, useEffect, useState } from 'react'
import { createInductee, updateInductee } from './actions'
import { useRouter } from 'next/navigation'
import { Inductee } from '@/lib/getHallOfFame'
import { Save, User, Award, X, Image as ImageIcon, ExternalLink } from 'lucide-react'
import InducteePhoto from '@/components/HallOfFame/InducteePhoto'
import ImageUpload from '@/components/ImageUpload'
import VideoUpload from '@/components/VideoUpload'
import { Video } from 'lucide-react'

interface InducteeFormProps {
  inductee?: Inductee
  schoolId: string
  isEdit?: boolean
}

const initialState = { error: '', success: false }

export default function InducteeForm({ inductee, schoolId, isEdit = false }: InducteeFormProps) {
  const router = useRouter()
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(isEdit ? updateInductee : createInductee, initialState)

  // Achievements cleanup: recursive to handle nested stringification
  const cleanAchievements = (val: any): string => {
    if (Array.isArray(val)) return val.map(s => s.trim()).join('\n')
    if (typeof val === 'string') {
      let current = val
      // Try to parse up to 5 times to handle deeply nested legacy strings
      for (let i = 0; i < 5; i++) {
        try {
          const parsed = JSON.parse(current)
          if (Array.isArray(parsed)) {
            current = parsed.map(s => String(s).trim()).join('\n')
          } else if (typeof parsed === 'string') {
            current = parsed
            continue
          }
        } catch (e) {
          break
        }
      }
      return current.replace(/\r/g, '').split('\n').map(s => s.trim()).filter(Boolean).join('\n')
    }
    return ''
  }

  // Live Preview State
  const [formData, setFormData] = useState({
    name: inductee?.name || '',
    year: inductee?.year || '',
    category: inductee?.category || 'Athlete',
    photo_url: inductee?.photo_url || '',
    video_url: inductee?.video_url || '',
    bio: inductee?.bio || '',
    achievements: cleanAchievements(inductee?.achievements),
    induction_year: inductee?.induction_year || ''
  })

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/hall-of-fame')
    }
  }, [state?.success, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10">
      <form action={formAction} className="flex-1 space-y-6">
        <input type="hidden" name="school_id" value={schoolId} />
        {isEdit && <input type="hidden" name="id" value={inductee?.id} />}

        <div className="glass-card p-6 rounded-2xl border-none space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                        placeholder="e.g. Michael Jordan"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Years Served or Class Year</label>
                    <input
                        name="year"
                        type="text"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                        placeholder="e.g. 1998 or 1995-2005"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year Inducted</label>
                <input
                    name="induction_year"
                    type="number"
                    defaultValue={inductee?.induction_year || ''}
                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                    placeholder="e.g. 2010"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Selection Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft appearance-none cursor-pointer"
                >
                    <option value="Athlete">Athlete</option>
                    <option value="Coach">Coach</option>
                    <option value="Contributor">Contributor</option>
                    <option value="Team">Team</option>
                </select>
            </div>

            <ImageUpload 
                currentImageUrl={formData.photo_url}
                recommendation="Recommended: 600x800px (3:4 ratio)"
                onImageSelect={(file) => {
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, photo_url: reader.result as string }))
                    }
                    reader.readAsDataURL(file)
                  } else {
                    setFormData(prev => ({ ...prev, photo_url: inductee?.photo_url || '' }))
                  }
                }}
            />
            {/* Hidden field to preserve existing URL if no new file is selected */}
            <input type="hidden" name="photo_url" value={inductee?.photo_url || ''} />

            <VideoUpload 
                currentVideoUrl={formData.video_url}
                recommendation="Recommended: 1080p MP4 (Max 20MB)"
                onVideoSelect={(file) => {
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setFormData(prev => ({ ...prev, video_url: url }))
                  } else {
                    setFormData(prev => ({ ...prev, video_url: inductee?.video_url || '' }))
                  }
                }}
            />
            <input type="hidden" name="video_url" value={inductee?.video_url || ''} />

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Short Biography</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-xs shadow-soft leading-tight resize-none"
                    placeholder="Briefly describe their legacy..."
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Key Achievements (One per line)</label>
                <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-xs shadow-soft leading-tight resize-none"
                    placeholder="State Champion 1998&#10;MVP 1999"
                />
            </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100">
            {state.error}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-2">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-400 font-bold uppercase tracking-widest text-[9px] hover:text-gray-900 transition-colors"
            >
                Discard Changes
            </button>
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 text-[10px] uppercase tracking-widest"
            >
                <Save size={14} />
                {isPending ? 'Processing...' : isEdit ? 'Update Profile' : 'Publish Inductee'}
            </button>
        </div>
      </form>

      {/* 🔮 Preview Side-bar */}
      <div className="xl:w-64 space-y-4">
        <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Profile Preview</h2>
        
        <div className="glass-card rounded-[2rem] border-none overflow-hidden flex flex-col items-center p-6 text-center relative group">
            <div className="relative mb-4">
                <InducteePhoto 
                    src={formData.photo_url} 
                    name={formData.name} 
                    size="lg"
                />
                {formData.video_url && (
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-black text-white rounded-lg shadow-lg">
                        <Video size={10} />
                    </div>
                )}
            </div>

            <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 truncate w-full">
                {formData.name || 'Inductee Name'}
            </h3>
            
            <div className="flex flex-col items-center gap-2 mb-4">
                <span className="px-3 py-0.5 bg-gray-50 text-[8px] font-bold uppercase tracking-widest rounded-full text-gray-400 border border-gray-100">
                    {formData.year || '----'}
                </span>
                {formData.induction_year && (
                    <span className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">
                        Inducted {formData.induction_year}
                    </span>
                )}
                <div className="flex items-center gap-1 text-blue-500">
                    <Award size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{formData.category}</span>
                </div>
            </div>

            <div className="w-full space-y-3 pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                    {formData.bio || 'Their story starts here...'}
                </p>

                <div className="flex flex-wrap justify-center gap-1.5">
                    {(Array.isArray(formData.achievements) 
                        ? formData.achievements 
                        : (formData.achievements || '').split('\n')
                    ).filter(Boolean).slice(0, 3).map((a, i) => (
                        <div key={i} className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[7px] font-black text-gray-500 uppercase tracking-tighter">
                            {a}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <p className="text-[8px] text-gray-400 text-center px-6 font-bold uppercase tracking-tight leading-tight">
            How the inductee will appear in the kiosk grid.
        </p>
      </div>
    </div>

  )
}
