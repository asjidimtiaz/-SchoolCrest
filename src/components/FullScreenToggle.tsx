'use client'

import { Maximize } from 'lucide-react'
import { useKiosk } from '@/context/KioskContext'

export default function FullScreenToggle() {
  const { isFullscreen } = useKiosk()

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

  if (isFullscreen) return null

  return (
    <button
      onClick={toggleFullscreen}
      className="p-3 bg-white/10 active:scale-95 backdrop-blur-md rounded-xl text-white transition-all shadow-lg border border-white/10 flex items-center justify-center group"
      title="Go Full Screen"
    >
      <Maximize size={20} />
      
    </button>
  )
}
