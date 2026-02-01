'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from './actions'
import { User, Mail, Shield, Building2, Globe, CheckCircle, AlertCircle, Loader2, Save, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { uploadFileClient } from '@/lib/supabaseClient'

interface ProfileProps {
  admin: {
    email: string
    full_name: string | null
    avatar_url: string | null
    role: string
    school: {
      name: string
      slug: string
      active: boolean
    } | null
  }
  isSuperAdmin?: boolean
}

const initialState = {
  error: '',
  success: false,
}

export default function ProfilePageClient({ admin, isSuperAdmin = false }: ProfileProps) {
  const router = useRouter()
  const [actionState, setActionState] = useState(initialState)
  const [isUploading, setIsUploading] = useState(false)

  // Track selected avatar locally
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null)

  // @ts-ignore
  const [state, formAction, isPendingAction] = useActionState(updateProfile, initialState)

  const isPending = isPendingAction || isUploading

  // Controlled state for full name to ensure it updates when props change
  const [fullName, setFullName] = useState(admin.full_name || '')

  // Update internal state if props change (e.g., after success or mount)
  useEffect(() => {
    setFullName(admin.full_name || '')
  }, [admin.full_name])

  // Refresh router on success
  useEffect(() => {
    if (state?.success || actionState?.success) {
      router.refresh()
    }
    if (state?.error) {
      setActionState({ error: state.error, success: false })
    }
  }, [state, actionState?.success, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setActionState({ error: '', success: false })

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      // 1. Upload Avatar if selected
      if (selectedAvatar) {
        const ext = selectedAvatar.name.split('.').pop()
        const path = `avatars/${admin.school?.slug || 'system'}/${Date.now()}_avatar.${ext}`
        const publicUrl = await uploadFileClient(selectedAvatar, 'school-assets', path)
        if (publicUrl) {
          formData.set('avatarUrl', publicUrl)
          formData.delete('avatar_file')
        } else {
          throw new Error('Failed to upload avatar. Please try again.')
        }
      }

      // 2. Call Server Action
      const result = await updateProfile(null, formData)

      if (result.success) {
        setActionState({ error: '', success: true })
      } else {
        setActionState({ error: result.error || 'Failed to update profile.', success: false })
      }
    } catch (err: any) {
      console.error('Profile Update Error:', err)
      setActionState({ error: err.message || 'An unexpected error occurred.', success: false })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-400 font-medium tracking-tight uppercase tracking-widest text-[9px]">Administrative Identity & Credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSubmit} className="glass-card rounded-[1.5rem] overflow-hidden border-none p-1">
            <div className="bg-white/50 p-5 space-y-6 rounded-xl">
              <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
                  <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Manage your display name and avatar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  {!isSuperAdmin ? (
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm shadow-soft"
                        />
                      </div>
                    </div>
                  ) : (
                    <input type="hidden" name="fullName" value={admin.full_name || ''} />
                  )}
                </div>

                <div className="space-y-4">
                  <ImageUpload
                    name="avatar_file"
                    label="Profile Avatar"
                    description="Upload your console avatar (square recommended)"
                    currentImageUrl={admin.avatar_url}
                    onImageSelect={(file) => setSelectedAvatar(file)}
                  />
                  {/* Hidden field to preserve existing URL if no new file is selected */}
                  <input type="hidden" name="avatarUrl" value={admin.avatar_url || ''} />
                  <p className="text-[8px] text-gray-400 ml-1 font-bold uppercase tracking-wider">Your photo will be visible in the sidebar and profile cards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 opacity-60">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      Email address

                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="email"
                        readOnly
                        value={admin.email}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 border border-gray-100/50 rounded-xl cursor-not-allowed font-semibold text-gray-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 opacity-60">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      Platform Role
                    </label>
                    <div className="relative">
                      <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        readOnly
                        value={admin.role === 'super_admin' ? 'Super Administrator' : 'School Administrator'}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 border border-gray-100/50 rounded-xl cursor-not-allowed font-semibold text-gray-400 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {actionState.error && (
                <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-black flex items-center gap-2.5 border border-red-100">
                  <AlertCircle size={16} />
                  {actionState.error}
                </div>
              )}

              {actionState.success && (
                <div className="p-3.5 bg-green-50 text-green-600 rounded-xl text-xs font-black flex items-center gap-2.5 border border-green-100">
                  <CheckCircle size={16} />
                  Profile updated successfully!
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex justify-end bg-gray-50/50 border-t border-gray-100">
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex items-center gap-2.5 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest shadow-xl shadow-black/5"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} className="opacity-70" />
                    Save Changes
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform opacity-50" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: School Info */}
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-[1.5rem] space-y-4 border-none relative overflow-hidden bg-white/40">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100/50">
                <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                  <Building2 size={16} />
                </div>
                <h2 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Institution Data</h2>
              </div>

              {admin.school ? (
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-1">Host Institution</label>
                    <p className="font-extrabold text-base text-gray-900 group-hover:text-black transition-colors leading-tight">{admin.school.name}</p>
                  </div>

                  <div className="group">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-1">Public Access</label>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-soft font-bold text-gray-600 text-xs">
                      <Globe size={14} className="text-blue-500" />
                      <span className="truncate">{admin.school?.slug}.schoolcrest...</span>
                    </div>
                  </div>

                  <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex items-center justify-between">
                    <div>
                      <label className="text-[7px] font-black text-green-600/70 uppercase tracking-widest block mb-px">Status</label>
                      <span className="font-black text-green-700 text-[10px]">ACTIVE & SYNCED</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold italic text-xs">No school assigned</p>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
