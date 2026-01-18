'use client'

import { useActionState, useEffect, useState } from 'react'
import { upsertEvent } from './actions'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Save, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'

interface EventFormProps {
  event?: any
  schoolId: string
  isEdit?: boolean
}

const initialState = { error: '', success: false }

export default function EventForm({ event, schoolId, isEdit = false }: EventFormProps) {
  const router = useRouter()
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(upsertEvent, initialState)

  // Live Preview State
  const [formData, setFormData] = useState({
    title: event?.title || '',
    start_time: event?.start_time || new Date().toISOString(),
    location: event?.location || '',
    category: event?.category || 'General',
    description: event?.description || ''
  })

  const defaultEventCategories = ['General', 'Athletics', 'Academic', 'Arts', 'Holiday', 'Testing', 'Meeting']
  const [isCustomCategory, setIsCustomCategory] = useState(
    formData.category !== '' && !defaultEventCategories.includes(formData.category)
  )

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/calendar')
    }
  }, [state?.success, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Format date for datetime-local input
  const defaultDate = formData.start_time 
    ? format(new Date(formData.start_time), "yyyy-MM-dd'T'HH:mm") 
    : format(new Date(), "yyyy-MM-dd'T'HH:mm")

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-10">
      <form action={formAction} className="flex-1 space-y-6">
        <input type="hidden" name="school_id" value={schoolId} />
        {isEdit && <input type="hidden" name="id" value={event?.id} />}

        <div className="glass-card p-6 rounded-2xl border-none space-y-5">
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Event Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft"
                    placeholder="e.g. Basketball vs. Central High"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Schedule Date & Time</label>
                    <input
                        name="start_time"
                        type="datetime-local"
                        value={defaultDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_time: new Date(e.target.value).toISOString() }))}
                        required
                        className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft appearance-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <div className="space-y-2">
                        {/* Always send the category value */}
                        <input type="hidden" name="category" value={formData.category} />

                        <div className="relative">
                            <select
                                value={defaultEventCategories.includes(formData.category) ? formData.category : 'Other'}
                                onChange={(e) => {
                                    const val = e.target.value
                                    if (val === 'Other') {
                                        setIsCustomCategory(true)
                                        setFormData(prev => ({ ...prev, category: '' }))
                                    } else {
                                        setIsCustomCategory(false)
                                        setFormData(prev => ({ ...prev, category: val }))
                                    }
                                }}
                                className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft appearance-none cursor-pointer"
                            >
                                {defaultEventCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="Other">Other...</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 rotate-90 pointer-events-none" size={14} />
                        </div>

                        {(isCustomCategory || (formData.category !== '' && !defaultEventCategories.includes(formData.category))) && (
                            <input
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                required
                                className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-sm shadow-soft animate-in fade-in slide-in-from-top-2 duration-300"
                                placeholder="Enter custom category (e.g. Workshop, Seminar, etc.)"
                                autoFocus={isCustomCategory}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Event Location</label>
                <div className="relative">
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-xs shadow-soft pl-10"
                        placeholder="e.g. Main Gymnasium"
                    />
                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Internal Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none font-bold text-xs shadow-soft leading-tight resize-none"
                    placeholder="Details for administrative reference..."
                />
            </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100">
            {state.error}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-2">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-900 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 text-[11px]"
            >
                <Save size={14} />
                {isPending ? 'Processing...' : isEdit ? 'Update Event' : 'Schedule Event'}
            </button>
        </div>
      </form>

      {/* 🔮 Preview Side-bar */}
      <div className="xl:w-64 space-y-4">
        <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Calendar Preview</h2>
        
        <div className="glass-card rounded-[2rem] border-none overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-black rounded-xl flex flex-col items-center justify-center text-white">
                    <p className="text-[7px] font-black uppercase opacity-70 tracking-tighter">
                        {format(new Date(formData.start_time), 'MMM')}
                    </p>
                    <p className="text-sm font-black leading-none mt-0.5">
                        {format(new Date(formData.start_time), 'd')}
                    </p>
                </div>
                <span className="px-3 py-0.5 bg-gray-50 text-[8px] font-black uppercase tracking-widest rounded-full text-gray-400 border border-gray-100">
                    {formData.category}
                </span>
            </div>

            <div className="space-y-3">
                <h3 className="text-base font-black text-gray-900 leading-tight truncate w-full">
                    {formData.title || 'Untitled Event'}
                </h3>
                
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={12} className="opacity-50" />
                        <span className="text-[10px] font-bold tracking-tight">
                            {format(new Date(formData.start_time), 'h:mm a')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={12} className="opacity-50" />
                        <span className="text-[10px] font-bold tracking-tight truncate max-w-[150px]">
                            {formData.location || 'Location Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <p className="text-[8px] text-gray-400 text-center px-6 font-bold uppercase tracking-tight leading-tight">
            How the event will appear in the system calendar.
        </p>
      </div>
    </div>

  )
}
