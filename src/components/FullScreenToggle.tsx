'use client'

import { Maximize, Minimize } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FullScreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md rounded-xl text-white transition-all shadow-lg border border-white/10 flex items-center justify-center group"
      title={isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'}
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      <span className="ml-2 text-[10px] font-black uppercase tracking-widest hidden group-hover:inline-block transition-all">
        {isFullscreen ? 'Exit Full' : 'Full Screen'}
      </span>
    </button>
  )
}
