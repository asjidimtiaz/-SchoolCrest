'use client'

import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { Upload, X, Video, CheckCircle2, AlertCircle } from 'lucide-react'

interface VideoUploadProps {
  onVideoSelect?: (file: File | null) => void
  currentVideoUrl?: string | null
  label?: string
  description?: string
  className?: string
  name?: string
  required?: boolean
  recommendation?: string
}

export default function VideoUpload({ 
  onVideoSelect, 
  currentVideoUrl, 
  label = "Inductee Video", 
  description = "Drag and drop or click to upload video",
  className = "",
  name = "video_file",
  required = false,
  recommendation
}: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentVideoUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentVideoUrl) {
      setPreview(currentVideoUrl)
    }
  }, [currentVideoUrl])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file.')
      return
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      alert('Video file is too large. Max size is 20MB.')
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    onVideoSelect?.(file)
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

  const clearVideo = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onVideoSelect?.(null)
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
          accept="video/*"
          className="hidden"
          name={name}
          required={required && !preview}
        />

        {preview ? (
          <div className="relative w-full h-full animate-fade-in group">
            <video 
              src={preview} 
              className="w-full h-full object-cover"
              muted
              playsInline
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => {
                const video = e.target as HTMLVideoElement;
                video.pause();
                video.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 bg-white text-black font-black text-[10px] uppercase rounded-lg hover:scale-105 transition-transform"
                >
                  Change
                </button>
                <button 
                  onClick={clearVideo}
                  className="p-2 bg-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {/* Type Badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white rounded-full flex items-center gap-1 shadow-lg animate-slide-up">
              <Video size={10} />
              <span className="text-[8px] font-black uppercase tracking-tight">Video Loaded</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-black text-white scale-110 shadow-xl' : 'bg-gray-50 text-gray-300 group-hover:text-gray-400'}
            `}>
              <Video size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{description}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Supports MP4, MOV (Max 20MB)</p>
              {recommendation && (
                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest animate-pulse mt-1">{recommendation}</p>
              )}
            </div>
          </div>
        )}

        {isDragging && !preview && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
            <div className="px-6 py-3 bg-white shadow-2xl rounded-2xl border border-black/5 flex items-center gap-3 animate-slide-up">
              <Video className="text-black" size={20} />
              <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">Drop to load video</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
