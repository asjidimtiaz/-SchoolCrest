'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
      const val = parseFloat(e.target.value)
      const newTime = (val / 100) * videoRef.current.duration
      if (isFinite(newTime)) {
        videoRef.current.currentTime = newTime
        setProgress(val)
      }
    }
  }

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className={`relative group/player rounded-[2.5rem] overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        muted={isMuted}
        playsInline
      />

      {/* Custom Controls */}
      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-500">
        <div className="space-y-4">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-all font-bold"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>

              <button
                onClick={restart}
                className="p-3 text-white/60 hover:text-white transition-colors"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={toggleMute}
                className="p-3 text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Cinema View Active
            </div>
          </div>
        </div>
      </div>

      {/* Center Play Button Overlay (when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-100 group-hover/player:scale-110 transition-transform duration-500">
            <Play size={40} fill="currentColor" className="ml-2" />
          </div>
        </div>
      )}
    </div>
  )
}
