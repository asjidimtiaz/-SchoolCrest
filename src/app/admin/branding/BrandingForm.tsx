'use client'

import { useActionState, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
    Palette,
    Save,
    Smartphone,
    LayoutTemplate,
    Pipette,
    Trash2,
    Trophy,
    Users,
    Calendar,
    Info,
    Hash
} from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import { uploadFileClient } from '@/lib/supabaseClient'
import { updateBranding } from './actions'

interface BrandingFormProps {
    school: any
    galleryImages?: any[]
}

const initialState = { error: '', success: false }

export default function BrandingForm({ school, galleryImages = [] }: BrandingFormProps) {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({})

    const primaryRef = useRef<HTMLInputElement>(null)
    const secondaryRef = useRef<HTMLInputElement>(null)
    const accentRef = useRef<HTMLInputElement>(null)

    const getGalleryVal = (idx: number) => galleryImages.find(img => img.order_index === idx)?.image_url || '';

    // Live Preview State (Restore full detailed state)
    const [previewData, setPreviewData] = useState({
        logo_url: school.logo_url || '',
        primary_color: school.primary_color || '#000000',
        secondary_color: school.secondary_color || '#ffffff',
        accent_color: school.accent_color || '#ffd700',
        background_url: school.background_url || '',
        background_type: school.background_type || 'image',
        sponsor_logo_1: school.sponsor_logo_1 || '',
        sponsor_logo_2: school.sponsor_logo_2 || '',
        sponsor_logo_3: school.sponsor_logo_3 || '',
        gallery_image_1: getGalleryVal(1),
        gallery_image_2: getGalleryVal(2),
        gallery_image_3: getGalleryVal(3),
        nav_hall_of_fame_label: school.nav_hall_of_fame_label || 'Hall of Fame',
        nav_teams_label: school.nav_teams_label || 'Athletic Teams',
        nav_calendar_label: school.nav_calendar_label || 'Campus Events',
        nav_info_label: school.nav_info_label || 'School Profile',
        nav_hall_of_fame_tagline: school.nav_hall_of_fame_tagline || 'Honoring exceptional alumni and staff',
        nav_teams_tagline: school.nav_teams_tagline || 'Explore our sports and history',
        nav_calendar_tagline: school.nav_calendar_tagline || 'Stay updated with school activities',
        nav_info_tagline: school.nav_info_tagline || 'Information about our community',
        // We include these in preview just for the screensaver preview block at the bottom
        name: school.name || '',
        tagline: school.tagline || '',
    })

    const [actionState, setActionState] = useState(initialState)

    const handleBackgroundFileSelect = (file: File | null) => {
        if (!file) {
            setPreviewData(prev => ({ ...prev, background_url: '', background_type: 'image' }))
            setPendingFiles(prev => {
                const newFiles = { ...prev }
                delete newFiles.background_file
                return newFiles
            })
            return
        }
        const objectUrl = URL.createObjectURL(file)
        const type = file.type.startsWith('video') ? 'video' : 'image'
        setPreviewData(prev => ({ ...prev, background_url: objectUrl, background_type: type }))
        setPendingFiles(prev => ({ ...prev, background_file: file }))
    }

    const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewData(prev => ({ ...prev, [fieldName]: objectUrl }));
            setPendingFiles(prev => ({ ...prev, [fieldName]: file }));
        }
    };

    const handleLogoSelect = (file: File | null) => {
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreviewData(prev => ({ ...prev, logo_url: objectUrl }))
            setPendingFiles(prev => ({ ...prev, logo_file: file }));
        } else {
            setPreviewData(prev => ({ ...prev, logo_url: '' }))
            setPendingFiles(prev => {
                const next = { ...prev };
                delete next.logo_file;
                return next;
            });
        }
    }

    const handleBackgroundMediaChange = (url: string | null, type: 'image' | 'video') => {
        setPreviewData(prev => ({ ...prev, background_url: url || '', background_type: type }))
    }

    const handleDeleteSponsor = (i: number) => {
        setPreviewData(prev => ({ ...prev, [`sponsor_logo_${i}`]: '' }));
        setPendingFiles(prev => {
            const next = { ...prev };
            delete next[`sponsor_logo_${i}`];
            return next;
        });
    }

    const handleDeleteGallery = (i: number) => {
        setPreviewData(prev => ({ ...prev, [`gallery_image_${i}`]: '' }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUploading(true)
        setActionState({ error: '', success: false })

        try {
            const uploadedUrls: Record<string, string> = {}
            for (const [fieldName, file] of Object.entries(pendingFiles)) {
                let folder = 'others'
                if (fieldName === 'logo_file') folder = 'logos'
                if (fieldName === 'background_file') folder = 'backgrounds'
                if (fieldName.startsWith('sponsor_logo')) folder = 'sponsors'
                if (fieldName.startsWith('gallery_image')) folder = 'gallery'

                const ext = file.name.split('.').pop()
                const path = `${folder}/${school.id}/${Date.now()}_${fieldName}.${ext}`
                const publicUrl = await uploadFileClient(file, 'school-assets', path)
                if (publicUrl) uploadedUrls[fieldName] = publicUrl
            }

            const formData = new FormData()
            formData.append('id', school.id)

            Object.entries(previewData).forEach(([key, value]) => {
                if (uploadedUrls[key]) {
                    formData.append(key, uploadedUrls[key])
                } else if (key === 'logo_url' && uploadedUrls['logo_file']) {
                    formData.append(key, uploadedUrls['logo_file'])
                } else if (key === 'background_url' && uploadedUrls['background_file']) {
                    formData.append(key, uploadedUrls['background_file'])
                } else if (!String(value).startsWith('blob:')) {
                    formData.append(key, String(value ?? ''))
                }
            })

            // Gallery logic same as before
            for (let i = 1; i <= 3; i++) {
                if (uploadedUrls[`gallery_image_${i}`]) {
                    formData.append(`uploaded_gallery_image_${i}`, uploadedUrls[`gallery_image_${i}`])
                }
                // @ts-ignore
                if (!previewData[`gallery_image_${i}`]) {
                    formData.append(`deleted_gallery_image_${i}`, 'true');
                }
            }

            const result = await updateBranding(formData)
            if (result.success) {
                setActionState({ error: '', success: true })
                router.refresh()
            } else {
                setActionState({ error: result.error || 'Failed to update', success: false })
            }
        } catch (err: any) {
            setActionState({ error: err.message, success: false })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 pb-20">
            <form onSubmit={handleSubmit} className="flex-1 space-y-8">
                <input type="hidden" name="id" value={school.id} />

                {/* SECTION: VISUAL BRANDING - Restored layout */}
                <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <Palette size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Visual Branding</h2>
                            <p className="text-[10px] text-gray-400 font-medium">Logos and colors used for kiosk and home page themes.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-12 xl:col-span-5 space-y-2">
                            <MediaUpload
                                label="Official School Logo"
                                description="Upload PNG or JPG (Transparent recommended)"
                                recommendation="Recommended: 512x512px (Circle/Square)"
                                currentMediaUrl={previewData.logo_url}
                                onFileSelect={handleLogoSelect}
                                className="h-full"
                            />
                            <input type="hidden" name="logo_url" value={previewData.logo_url.startsWith('blob:') ? '' : previewData.logo_url} />
                        </div>

                        <div className="md:col-span-12 xl:col-span-7 space-y-6">
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Brand Colors</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: 'Primary Color', name: 'primary_color', ref: primaryRef, sub: 'Main brand color (headers, buttons)' },
                                        { label: 'Secondary Color', name: 'secondary_color', ref: secondaryRef, sub: 'Accents and complements' },
                                        { label: 'Accent Color', name: 'accent_color', ref: accentRef, sub: 'Highlights and interactive elements' }
                                    ].map((c) => (
                                        <div key={c.name} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 group hover:bg-white hover:border-gray-200 transition-all">
                                            <div
                                                onClick={() => (c.ref.current as HTMLInputElement).click()}
                                                className="relative w-12 h-12 rounded-lg shadow-sm border border-black/5 overflow-hidden flex-shrink-0 cursor-pointer group/picker"
                                                style={{ backgroundColor: (previewData as any)[c.name] }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/picker:bg-black/20 transition-colors">
                                                    <Pipette size={14} className="text-white drop-shadow-md" />
                                                </div>
                                                <input
                                                    type="color"
                                                    ref={c.ref}
                                                    value={(previewData as any)[c.name]}
                                                    onChange={(e) => setPreviewData(prev => ({ ...prev, [c.name]: e.target.value }))}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-gray-900">{c.label}</p>
                                                <p className="text-[10px] text-gray-400">{c.sub}</p>
                                            </div>
                                            <div className="relative">
                                                <Hash className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={10} />
                                                <input
                                                    type="text"
                                                    value={(previewData as any)[c.name].replace('#', '')}
                                                    onChange={(e) => {
                                                        const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                                                        if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                            setPreviewData(prev => ({ ...prev, [c.name]: val }))
                                                        }
                                                    }}
                                                    className="w-20 pl-5 pr-2 py-1 text-xs font-mono font-medium text-gray-700 bg-white rounded border border-gray-200 outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: LANDING PAGE BACKGROUND - Restored layout */}
                <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <LayoutTemplate size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Landing Page Background</h2>
                            <p className="text-[10px] text-gray-400 font-medium">Video or image shown on the screensaver/landing page.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <MediaUpload
                            label="Background Media"
                            description="Upload an image or video for the landing page background"
                            recommendation="Recommended: 1920x1080px (16:9 ratio)"
                            currentMediaUrl={previewData.background_url}
                            currentMediaType={previewData.background_type as any}
                            onMediaChange={handleBackgroundMediaChange}
                            onFileSelect={handleBackgroundFileSelect}
                        />
                        <input type="hidden" name="background_url" value={previewData.background_url.startsWith('blob:') ? '' : previewData.background_url} />
                        <input type="hidden" name="background_type" value={previewData.background_type} />
                    </div>
                </section>

                {/* SECTION: NAVIGATION LABELS - Restored full detailed section */}
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-50">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <Smartphone size={22} />
                        </div>
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Navigation & Labels</h2>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Customize the names and taglines of the main menu items.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                        {[
                            { id: 'hall_of_fame', icon: Trophy, label: 'Hall of Fame' },
                            { id: 'teams', icon: Users, label: 'Athletic Teams' },
                            { id: 'calendar', icon: Calendar, label: 'Calendar' },
                            { id: 'info', icon: Info, label: 'School Profile' }
                        ].map((item) => (
                            <div key={item.id} className="space-y-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-400">
                                        <item.icon size={16} />
                                    </div>
                                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">{item.label}</h3>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Label</label>
                                    <input
                                        name={`nav_${item.id}_label`}
                                        value={(previewData as any)[`nav_${item.id}_label`]}
                                        onChange={(e) => setPreviewData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tagline Description</label>
                                    <input
                                        name={`nav_${item.id}_tagline`}
                                        value={(previewData as any)[`nav_${item.id}_tagline`]}
                                        onChange={(e) => setPreviewData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-700 placeholder:text-gray-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* GALLERIES & SPONSORS - Moved to individual rows */}
                <div className="space-y-8">
                    {/* SPONSOR LOGOS */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-[1.25rem]">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 leading-none">Sponsors</h2>
                                <p className="text-[10px] text-gray-400 font-bold mt-1.5 opacity-80">Logos shown on the idle screen.</p>
                            </div>
                        </div>
                        <div className="flex justify-center -space-x-4 py-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="group/sponsor relative">
                                    <div className="relative h-32 w-32 bg-white rounded-full border-2 border-dashed border-gray-200 hover:border-black/20 hover:scale-105 transition-all flex items-center justify-center overflow-hidden shadow-sm">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                            onChange={(e) => handleFilePreview(e, `sponsor_logo_${i}`)}
                                        />
                                        {(previewData as any)[`sponsor_logo_${i}`] ? (
                                            <div className="relative w-full h-full p-5">
                                                <img src={(previewData as any)[`sponsor_logo_${i}`]} className="h-full w-full object-contain" />
                                                <button type="button" onClick={() => handleDeleteSponsor(i)} className="absolute inset-0 flex items-center justify-center bg-red-500/90 text-white transition-all z-20 opacity-0 group-hover/sponsor:opacity-100">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">+ Logo</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SCHOOL GALLERY */}
                    <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                            <div className="p-3 bg-pink-50 text-pink-600 rounded-[1.25rem]">
                                <Palette size={24} />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 leading-none">Campus Gallery</h2>
                                <p className="text-[10px] text-gray-400 font-bold mt-1.5 opacity-80">Images for the profile page.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="group/gallery relative flex flex-col items-center">
                                    <div className="relative w-full aspect-[21/28] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-black/20 hover:scale-105 transition-all flex items-center justify-center overflow-hidden shadow-sm">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                            onChange={(e) => handleFilePreview(e, `gallery_image_${i}`)}
                                        />
                                        {(previewData as any)[`gallery_image_${i}`] ? (
                                            <div className="relative w-full h-full">
                                                <img src={(previewData as any)[`gallery_image_${i}`]} className="h-full w-full object-cover" />
                                                <button type="button" onClick={() => handleDeleteGallery(i)} className="absolute inset-0 flex items-center justify-center bg-red-500/90 text-white transition-all z-20 opacity-0 group-hover/gallery:opacity-100">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">+ Add</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="group flex items-center gap-3 px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
                    >
                        <span>{isUploading ? 'Saving Config...' : 'Save Configuration'}</span>
                        <Save size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {actionState?.error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                        {actionState.error}
                    </div>
                )}
                {actionState?.success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
                        Saved successfully!
                    </div>
                )}
            </form>

            {/* Live Preview Section */}
            <div className="xl:w-80 space-y-6 hidden xl:block">
                <div className="sticky top-8">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Smartphone size={16} className="text-gray-400" />
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Screensaver Preview</h2>
                    </div>

                    <div className="aspect-[9/16] bg-black rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        {previewData.background_url && (
                            previewData.background_type === 'video' ?
                                <video src={previewData.background_url} className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay loop muted />
                                : <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${previewData.background_url})` }} />
                        )}
                        <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center text-white">
                            {previewData.logo_url && <img src={previewData.logo_url} className="h-20 w-20 rounded-full object-cover mb-4 bg-white/10 p-1 backdrop-blur-sm" />}
                            <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">{previewData.name || 'School Name'}</h3>
                            <p className="text-[8px] font-bold opacity-70 mb-8 uppercase tracking-widest">{previewData.tagline}</p>
                            <div className="px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border-2 backdrop-blur-sm" style={{ borderColor: previewData.primary_color, backgroundColor: `${previewData.primary_color}40` }}>Touch to Start</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
