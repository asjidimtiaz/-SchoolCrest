'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface KioskContextType {
  isFullscreen: boolean
  setIsFullscreen: (val: boolean) => void
}

const KioskContext = createContext<KioskContextType | undefined>(undefined)

export function KioskProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Sync with browser's actual fullscreen state
    const syncFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    syncFullscreen()
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  return (
    <KioskContext.Provider value={{ isFullscreen, setIsFullscreen }}>
      {children}
    </KioskContext.Provider>
  )
}

export function useKiosk() {
  const context = useContext(KioskContext)
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider')
  }
  return context
}
