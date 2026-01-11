'use client'

// Force HMR rebuild
import { useActionState, useEffect, useState, useRef } from 'react'
import { updateSchoolBranding } from './actions'
import { useRouter } from 'next/navigation'
import { 
  School, 
  MapPin, 
  Palette, 
  Save, 
  Smartphone, 
  Mail, 
  Phone, 
  Type, 
  LayoutTemplate,
  Globe,
  Hash,
  Facebook,
  Instagram,
  Pipette
} from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'

interface BrandingFormProps {
  school: any
  galleryImages?: any[] 
}

const initialState = { error: '', success: false }

export default function BrandingForm({ school, galleryImages = [] }: BrandingFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // Store pending file uploads
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({})

  const primaryRef = useRef<HTMLInputElement>(null)
  const secondaryRef = useRef<HTMLInputElement>(null)
  const accentRef = useRef<HTMLInputElement>(null)

  // Helper to find existing gallery image by index
  const getGalleryVal = (idx: number) => galleryImages.find(img => img.order_index === idx)?.image_url || '';

  // Live Preview State
  const [previewData, setPreviewData] = useState({
    name: school.name || '',
    tagline: school.tagline || '',
    logo_url: school.logo_url || '',
    primary_color: school.primary_color || '#000000',
    secondary_color: school.secondary_color || '#ffffff',
    accent_color: school.accent_color || '#ffd700',
    calendar_url: school.calendar_url || '',
    background_url: school.background_url || '',
    background_type: school.background_type || 'image',
    sponsor_logo_1: school.sponsor_logo_1 || '',
    sponsor_logo_2: school.sponsor_logo_2 || '',
    sponsor_logo_3: school.sponsor_logo_3 || '',
    gallery_image_1: getGalleryVal(1), 
    gallery_image_2: getGalleryVal(2),
    gallery_image_3: getGalleryVal(3),
    about_quote: school.about_quote || '',
    about_quote_author: school.about_quote_author || '',
    about_quote_show_marks: school.about_quote_show_marks || false,
    about_text_show_marks: school.about_text_show_marks || false
  })

  // State for action result
  const [actionState, setActionState] = useState(initialState)
  const isPending = isUploading

  // Max file size in MB
  const MAX_FILE_SIZE_MB = 10
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
      const file = e.target.files?.[0];
      if (file) {
          // Check file size
          if (file.size > MAX_FILE_SIZE_BYTES) {
              setActionState({ 
                  error: `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${MAX_FILE_SIZE_MB}MB. Please compress your image or use a smaller one.`, 
                  success: false 
              })
              e.target.value = '' // Clear the input
              return
          }
          
          const objectUrl = URL.createObjectURL(file);
          setPreviewData(prev => ({ ...prev, [fieldName]: objectUrl }));
          // Store file for later upload
          setPendingFiles(prev => ({ ...prev, [fieldName]: file }));
          // Clear any previous error
          setActionState({ error: '', success: false })
      }
  };

  useEffect(() => {
    if (actionState?.success) {
      router.refresh()
    }
  }, [actionState?.success, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPreviewData(prev => ({ ...prev, [name]: value }))
  }

  // Handle Logo File Selection for Live Preview
  const handleLogoSelect = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewData(prev => ({ ...prev, logo_url: objectUrl }))
      // Store file for later upload
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

  // Handle Background Media Selection
  const handleBackgroundMediaChange = (url: string | null, type: 'image' | 'video') => {
    setPreviewData(prev => ({ 
      ...prev, 
      background_url: url || '', 
      background_type: type 
    }))
  }

  // Handle Background File Selection (separate from URL preview)
  const handleBackgroundFileSelect = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setPreviewData(prev => ({ ...prev, background_url: objectUrl, background_type: type }));
      setPendingFiles(prev => ({ ...prev, background_file: file }));
    }
  }

  // Custom submit handler: upload files via API, then call server action
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setActionState({ error: '', success: false })

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      // Upload pending files via API route (bypasses RLS issues)
      for (const [fieldName, file] of Object.entries(pendingFiles)) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('schoolId', school.id)
        
        let folder = 'gallery'
        if (fieldName.includes('sponsor')) folder = 'sponsors'
        if (fieldName === 'logo_file') folder = 'logos'
        if (fieldName === 'background_file') folder = 'backgrounds'
        
        uploadFormData.append('folder', folder)
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (res.ok) {
          const { url } = await res.json()
          // Map field names to their expected uploaded keys in action
          const keyMap: Record<string, string> = {
            'logo_file': 'uploaded_logo_url',
            'background_file': 'uploaded_background_url',
            'sponsor_logo_1': 'uploaded_sponsor_logo_1',
            'sponsor_logo_2': 'uploaded_sponsor_logo_2',
            'sponsor_logo_3': 'uploaded_sponsor_logo_3',
            'gallery_image_1': 'uploaded_gallery_image_1',
            'gallery_image_2': 'uploaded_gallery_image_2',
            'gallery_image_3': 'uploaded_gallery_image_3',
          }
          formData.set(keyMap[fieldName] || `uploaded_${fieldName}`, url)
        }
      }

      // Remove raw file inputs to prevent exceeding body size limit
      for (let i = 1; i <= 3; i++) {
        formData.delete(`sponsor_file_${i}`)
        formData.delete(`gallery_file_${i}`)
      }
      formData.delete('logo_file')
      formData.delete('background_file')

      // Call server action directly
      const result = await updateSchoolBranding(null, formData)
      setActionState({ error: result.error || '', success: result.success || false })
      if (result.success) {
        setPendingFiles({})
      }
    } catch (err) {
      setActionState({ error: 'Upload failed. Please try again.', success: false })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20">
      <form ref={formRef} onSubmit={handleSubmit} className="flex-1 space-y-8">
        <input type="hidden" name="id" value={school.id} />

        {/* SECTION: SCHOOL IDENTITY */}
        <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <School size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">School Identity</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Core information displayed across the platform.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">School Name</label>
                    <div className="relative group">
                        <input
                            name="name"
                            value={previewData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-4 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="e.g. Knights High School"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Tagline / Motto</label>
                    <input
                        name="tagline"
                        value={previewData.tagline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300"
                        placeholder="e.g. Tradition. Pride. Excellence."
                    />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">About Text</label>
                        <textarea
                            name="about_text"
                            defaultValue={school.about_text}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-600 placeholder:text-gray-300 resize-none"
                            placeholder="A brief description of your institution..."
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                        const newValue = !previewData.about_text_show_marks;
                        setPreviewData(prev => ({ ...prev, about_text_show_marks: newValue }));
                    }}>
                        <input 
                            type="hidden" 
                            name="about_text_show_marks" 
                            value={String(previewData.about_text_show_marks)} 
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${previewData.about_text_show_marks ? 'bg-black' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${previewData.about_text_show_marks ? 'left-5' : 'left-1'}`} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-900">Show Double Quotes for About Text</p>
                            <p className="text-[10px] text-gray-400 font-bold">Wrap main description in visual quote marks</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Featured Quote (Optional)</label>
                    <textarea
                        name="about_quote"
                        value={previewData.about_quote}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300 resize-none italic"
                        placeholder="e.g. Shaping the leaders of tomorrow."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Quote Author</label>
                    <input
                        name="about_quote_author"
                        value={previewData.about_quote_author}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300"
                        placeholder="e.g. John Doe, Principal"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                    const newValue = !previewData.about_quote_show_marks;
                    setPreviewData(prev => ({ ...prev, about_quote_show_marks: newValue }));
                }}>
                    <input 
                        type="hidden" 
                        name="about_quote_show_marks" 
                        value={String(previewData.about_quote_show_marks)} 
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors relative ${previewData.about_quote_show_marks ? 'bg-black' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${previewData.about_quote_show_marks ? 'left-5' : 'left-1'}`} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-900">Show Double Quotes</p>
                        <p className="text-[10px] text-gray-400 font-bold">Wrap featured quote in visual quote marks</p>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION: VISUAL BRANDING */}
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
                {/* Logo Upload */}
                <div className="md:col-span-5 space-y-2">
                    <MediaUpload 
                        name="logo_file"
                        label="Official School Logo"
                        description="Upload PNG or JPG (Transparent recommended)"
                        recommendation="Recommended: 512x512px (Circle/Square)"
                        currentMediaUrl={previewData.logo_url}
                        onFileSelect={handleLogoSelect}
                        className="h-full"
                    />
                     {/* Backup URL input just in case, hidden or small? Let's just rely on MediaUpload and hidden input for URL persistence if needed, 
                         but Actions handles logo_file. 
                         We DO need to preserve the OLD URL if no new file is selected. 
                         The action does NOT clear logo_url if logo_file is empty. 
                         But wait, if we change logo via URL input? 
                         Let's keep logo_url as a hidden input that updates if MediaUpload updates? 
                         MediaUpload handles files. 
                         Let's keep a hidden input for 'logo_url' in case they want to paste a URL? 
                         The generic MediaUpload doesn't support pasting URLs yet. 
                         Let's add a small text input for URL fallback below it or just trust the upload.
                         For professional UI, file upload is primary. 
                         Let's assume upload is key. 
                         Also need to pass existing logo_url to action if not changed? 
                         The action reads logo_url from formData. 
                         If we don't provide it in the form, it might be null?
                         The action UPDATE statement: logo_url. 
                         If formData.get('logo_url') is null/empty, it will overwrite with empty string!
                         So we MUST provide the existing logo_url as a hidden input.
                      */}
                      {/* Only send persistent URL, never blob string. If database current has a blob, send empty to clear it. */}
                      <input 
                        type="hidden" 
                        name="logo_url" 
                        value={
                          previewData.logo_url.startsWith('blob:') 
                            ? (school.logo_url && !school.logo_url.startsWith('blob:') ? school.logo_url : '') 
                            : previewData.logo_url
                        } 
                      />
                </div>

                {/* Color Palette */}
                <div className="md:col-span-7 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Brand Colors</label>
                        
                        {/* Hidden Inputs for Form Submission */}
                        <input type="hidden" name="primary_color" value={previewData.primary_color} />
                        <input type="hidden" name="secondary_color" value={previewData.secondary_color} />
                        <input type="hidden" name="accent_color" value={previewData.accent_color} />

                        <div className="grid grid-cols-1 gap-4">
                            {/* Primary */}
                            <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 group hover:bg-white hover:border-gray-200 transition-all">
                                <div 
                                    onClick={() => primaryRef.current?.click()}
                                    className="relative w-12 h-12 rounded-lg shadow-sm border border-black/5 overflow-hidden flex-shrink-0 cursor-pointer group/picker"
                                    style={{ backgroundColor: previewData.primary_color }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/picker:bg-black/20 transition-colors">
                                        <Pipette size={14} className="text-white drop-shadow-md" />
                                    </div>
                                    <input 
                                        type="color" 
                                        ref={primaryRef}
                                        value={previewData.primary_color}
                                        onChange={(e) => setPreviewData(prev => ({ ...prev, primary_color: e.target.value }))}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-900">Primary Color</p>
                                    <p className="text-[10px] text-gray-400">Main brand color (headers, buttons)</p>
                                </div>
                                <div className="relative">
                                    <Hash className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={10} />
                                    <input 
                                        type="text"
                                        value={previewData.primary_color.replace('#', '')}
                                        onChange={(e) => {
                                            const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                setPreviewData(prev => ({ ...prev, primary_color: val }))
                                            }
                                        }}
                                        className="w-20 pl-5 pr-2 py-1 text-xs font-mono font-medium text-gray-700 bg-white rounded border border-gray-200 outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>

                             {/* Secondary */}
                             <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 group hover:bg-white hover:border-gray-200 transition-all">
                                <div 
                                    onClick={() => secondaryRef.current?.click()}
                                    className="relative w-12 h-12 rounded-lg shadow-sm border border-black/5 overflow-hidden flex-shrink-0 cursor-pointer group/picker"
                                    style={{ backgroundColor: previewData.secondary_color }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/picker:bg-black/20 transition-colors">
                                        <Pipette size={14} className="text-white drop-shadow-md" />
                                    </div>
                                    <input 
                                        type="color" 
                                        ref={secondaryRef}
                                        value={previewData.secondary_color}
                                        onChange={(e) => setPreviewData(prev => ({ ...prev, secondary_color: e.target.value }))}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-900">Secondary Color</p>
                                    <p className="text-[10px] text-gray-400">Accents and complements</p>
                                </div>
                                <div className="relative">
                                    <Hash className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={10} />
                                    <input 
                                        type="text"
                                        value={previewData.secondary_color.replace('#', '')}
                                        onChange={(e) => {
                                            const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                setPreviewData(prev => ({ ...prev, secondary_color: val }))
                                            }
                                        }}
                                        className="w-20 pl-5 pr-2 py-1 text-xs font-mono font-medium text-gray-700 bg-white rounded border border-gray-200 outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>

                             {/* Accent */}
                             <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 group hover:bg-white hover:border-gray-200 transition-all">
                                <div 
                                    onClick={() => accentRef.current?.click()}
                                    className="relative w-12 h-12 rounded-lg shadow-sm border border-black/5 overflow-hidden flex-shrink-0 cursor-pointer group/picker"
                                    style={{ backgroundColor: previewData.accent_color }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/picker:bg-black/20 transition-colors">
                                        <Pipette size={14} className="text-white drop-shadow-md" />
                                    </div>
                                    <input 
                                        type="color" 
                                        ref={accentRef}
                                        value={previewData.accent_color}
                                        onChange={(e) => setPreviewData(prev => ({ ...prev, accent_color: e.target.value }))}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-900">Accent Color</p>
                                    <p className="text-[10px] text-gray-400">Highlights and interactive elements</p>
                                </div>
                                <div className="relative">
                                    <Hash className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={10} />
                                    <input 
                                        type="text"
                                        value={previewData.accent_color.replace('#', '')}
                                        onChange={(e) => {
                                            const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                                            if (/^#[0-9A-F]{0,6}$/i.test(val)) {
                                                setPreviewData(prev => ({ ...prev, accent_color: val }))
                                            }
                                        }}
                                        className="w-20 pl-5 pr-2 py-1 text-xs font-mono font-medium text-gray-700 bg-white rounded border border-gray-200 outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION: LANDING PAGE BACKGROUND */}
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
                    name="background_file"
                    label="Background Media"
                    description="Upload an image or video for the landing page background"
                    recommendation="Recommended: 1920x1080px (16:9 ratio)"
                    currentMediaUrl={previewData.background_url}
                    currentMediaType={previewData.background_type}
                    onMediaChange={handleBackgroundMediaChange}
                    onFileSelect={handleBackgroundFileSelect}
                />
                <input 
                    type="hidden" 
                    name="existing_background_url" 
                    value={
                        (previewData.background_url && !previewData.background_url.startsWith('blob:')) 
                            ? previewData.background_url 
                            : (school.background_url && !school.background_url.startsWith('blob:') ? school.background_url : '')
                    } 
                />
                <input type="hidden" name="background_type" value={previewData.background_type} />
            </div>
        </section>

        {/* SECTION: CONTACT INFO */}
        <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                    <MapPin size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Contact Details</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Public contact information for the directory.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Physical Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            name="address"
                            defaultValue={school.address}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="e.g. 123 Education Lane, Springfield"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            name="phone"
                            defaultValue={school.phone}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="(555) 123-4567"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Website URL</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                         <input
                            name="website_url"
                            defaultValue={school.website_url}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="https://yourschool.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Facebook URL</label>
                    <div className="relative">
                        <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                         <input
                            name="facebook_url"
                            defaultValue={school.facebook_url}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="https://facebook.com/yourschool"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Instagram URL</label>
                    <div className="relative">
                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                         <input
                            name="instagram_url"
                            defaultValue={school.instagram_url}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                            placeholder="https://instagram.com/yourschool"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION: SPONSOR LOGOS */}
        <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl">
                    <Smartphone size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Sponsors (Screensaver)</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Upload up to 3 sponsor logos to display on the idle screen.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Sponsor {i}</label>
                        <div className="relative h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center overflow-hidden group">
                           {/* File Input with Preview Handler */}
                           <input 
                                type="file" 
                                name={`sponsor_file_${i}`} 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                accept="image/*" 
                                title=""
                                onChange={(e) => handleFilePreview(e, `sponsor_logo_${i}`)}
                           />
                           
                           {/* Preview or Existing */}
                           {/* @ts-ignore */}
                           {previewData[`sponsor_logo_${i}`] ? (
                               // @ts-ignore
                               <img src={previewData[`sponsor_logo_${i}`]} className="h-full w-full object-contain p-2" />
                           ) : (
                               <div className="flex flex-col items-center">
                                   <span className="text-gray-300 text-xs font-bold">+ Upload</span>
                                   <span className="text-[7px] text-blue-500 font-black uppercase mt-1">400x200px</span>
                               </div>
                           )}
                           
                           {/* Hidden Input to persist existing URL if not changed (Action uses these) */}
                           <input type="hidden" name={`existing_sponsor_logo_${i}`} value={school[`sponsor_logo_${i}`] as string || ''} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        {/* SECTION: SCHOOL GALLERY */}
        <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                    <Palette size={20} />
                </div>
                <div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Campus Gallery</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Upload 3 images for the School Profile page.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Image {i}</label>
                         <div className="relative h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center overflow-hidden group">
                           <input 
                                type="file" 
                                name={`gallery_file_${i}`} 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                accept="image/*"
                                title=""
                                onChange={(e) => handleFilePreview(e, `gallery_image_${i}`)}
                           />
                           
                           {/* @ts-ignore */}
                           {previewData[`gallery_image_${i}`] ? (
                               // @ts-ignore
                                <img src={previewData[`gallery_image_${i}`]} className="h-full w-full object-cover" />
                           ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-300 text-xs font-bold">+ Upload</span>
                                    <span className="text-[7px] text-blue-500 font-black uppercase mt-1">800x600px</span>
                                </div>
                           )}
                        </div>
                    </div>
                ))}
            </div>
        </section>



        {/* STICKY FOOTER ACTIONS */}
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
           <button
              type="submit"
              disabled={isPending}
              className="group flex items-center gap-3 px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 hover:scale-105 transition-all shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
           >
              <span>{isPending ? 'Saving Config...' : 'Save Configuration'}</span>
              <Save size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        {actionState?.error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             {actionState.error}
          </div>
        )}
      </form>

      {/* 🔮 Live Preview Section - Revised */}
      <div className="xl:w-80 space-y-6 hidden xl:block">
        <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Smartphone size={16} className="text-gray-400" />
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Screensaver Preview</h2>
            </div>
            
            {/* Mock Screensaver Overlay */}
            <div className="aspect-[9/16] bg-black rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden relative group">
            {/* Glossy Reflection */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-50"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
            
            {/* Background Color/Image Placeholder */}
            {previewData.background_url ? (
                <>
                    {previewData.background_type === 'video' ? (
                        <video 
                            src={previewData.background_url}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-1000"
                            style={{ backgroundImage: `url(${previewData.background_url})` }}
                        />
                    )}
                </>
            ) : (
                <div className={`absolute inset-0 opacity-20 bg-[${previewData.primary_color}] mix-blend-overlay`} 
                     style={{backgroundColor: previewData.primary_color}}
                />
            )}

            <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center text-white">
                {previewData.logo_url ? (
                <img src={previewData.logo_url} alt="Logo" className="h-24 w-24 rounded-full object-cover mb-6 drop-shadow-2xl bg-white/10 backdrop-blur-sm p-1.5" />
                ) : (
                    <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                        <School size={32} className="text-white/50" />
                    </div>
                )}
                
                <h3 className="text-3xl font-black mb-3 leading-none tracking-tight drop-shadow-md" style={{ textShadow: `0 2px 10px ${previewData.primary_color}` }}>
                    {previewData.name || 'School Name'}
                </h3>
                
                <div className="w-12 h-1 bg-white/20 rounded-full mb-4" />

                <p className="text-[10px] font-bold opacity-80 mb-8 leading-relaxed uppercase tracking-widest max-w-[200px]">
                    {previewData.tagline || 'Your School Tagline'}
                </p>
                
                <div className="animate-pulse">
                    <div 
                        className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 backdrop-blur-sm"
                        style={{ 
                            borderColor: previewData.primary_color,
                            backgroundColor: `${previewData.secondary_color}40`,
                            color: '#ffffff',
                            boxShadow: `0 0 20px ${previewData.primary_color}40`
                        }}
                    >
                        Touch to Start
                    </div>
                </div>
            </div>
            
            {/* Simulated OS Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-30" />
            </div>
            
            <p className="text-[10px] text-gray-400 text-center px-4 font-bold uppercase tracking-wide pt-4">
                Real-time Screensaver Preview
            </p>
        </div>
      </div>
    </div>
  )
}
