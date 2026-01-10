'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { Upload, X, ImageIcon, CheckCircle2, AlertCircle, Film, PlayCircle } from 'lucide-react'

interface MediaUploadProps {
  onFileSelect?: (file: File | null) => void
  onMediaChange?: (url: string | null, type: 'image' | 'video') => void
  currentMediaUrl?: string | null
  currentMediaType?: 'image' | 'video' 
  label?: string
  description?: string
  className?: string
  name?: string
  required?: boolean
  recommendation?: string
}

export default function MediaUpload({ 
  onFileSelect, 
  onMediaChange,
  currentMediaUrl, 
  currentMediaType = 'image',
  label = "Program Media", 
  description = "Upload a photo or video",
  className = "",
  name = "media_file",
  required = false,
  recommendation
}: MediaUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentMediaUrl || null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>(currentMediaType)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when currentMediaUrl changes
  useEffect(() => {
    if (currentMediaUrl) {
      setPreview(currentMediaUrl)
      setMediaType(currentMediaType) // Ensure type syncs if provided
    }
  }, [currentMediaUrl, currentMediaType])

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      alert('Please upload an image or video file.')
      return
    }

    const type = isImage ? 'image' : 'video'
    setMediaType(type)

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onMediaChange?.(result, type)
    }
    reader.readAsDataURL(file)
    onFileSelect?.(file)
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const clearMedia = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onFileSelect?.(null)
    onMediaChange?.(null, mediaType)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative group cursor-pointer
          aspect-square md:aspect-video lg:aspect-[16/6] rounded-2xl
          border-2 border-dashed transition-all duration-300 overflow-hidden
          ${isDragging 
            ? 'border-black bg-black/[0.02] scale-[0.99]' 
            : 'border-gray-100 bg-white/50 hover:border-gray-300 hover:bg-white/80'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onFileChange}
          accept="image/*,video/*"
          className="hidden"
          name={name}
          required={required && !preview}
        />
        <input type="hidden" name="media_type" value={mediaType} />

        {preview ? (
          <div className="relative w-full h-full animate-fade-in bg-black">
            {mediaType === 'video' ? (
                <video 
                    src={preview} 
                    className="w-full h-full object-cover" 
                    controls={false} // Hide controls in preview, show play icon
                    muted
                    loop
                    autoPlay
                    playsInline
                />
            ) : (
                <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 bg-white text-black font-black text-[10px] uppercase rounded-lg hover:scale-105 transition-transform"
                >
                  Change
                </button>
                <button 
                  onClick={clearMedia}
                  className="p-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Success Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white rounded-full flex items-center gap-1 shadow-lg animate-slide-up z-10">
              <CheckCircle2 size={10} />
              <span className="text-[8px] font-black uppercase tracking-tight">
                {mediaType === 'video' ? 'Video Ready' : 'Image Ready'}
              </span>
            </div>

             {/* Video Indicator if video */}
             {mediaType === 'video' && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center gap-1 shadow-sm">
                    <Film size={10} />
                    <span className="text-[8px] font-black uppercase tracking-tight">Video</span>
                </div>
             )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-black text-white scale-110 shadow-xl' : 'bg-gray-50 text-gray-300 group-hover:text-gray-400'}
            `}>
              <Upload size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{description}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Supports IMG & Video (Max 50MB)</p>
              {recommendation && (
                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest animate-pulse mt-1">{recommendation}</p>
              )}
            </div>
          </div>
        )}

        {/* Dragging Overlay */}
        {isDragging && !preview && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
            <div className="px-6 py-3 bg-white shadow-2xl rounded-2xl border border-black/5 flex items-center gap-3 animate-slide-up">
              {/* <ImageIcon className="text-black" size={20} /> */}
              <Upload className="text-black" size={20} />
              <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Drop content here</span>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}
