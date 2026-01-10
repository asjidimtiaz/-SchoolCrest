'use client'

import { useEffect } from 'react'

export default function useKioskLock() {
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const blocked = [
        'F5',
        'F11',
        'F12',
        'Escape',
      ]

      // Ctrl / Cmd combos
      if (
        e.ctrlKey ||
        e.metaKey ||
        blocked.includes(e.key)
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const blockContext = (e: MouseEvent) => e.preventDefault()

    window.addEventListener('keydown', blockKeys)
    window.addEventListener('contextmenu', blockContext)

    return () => {
      window.removeEventListener('keydown', blockKeys)
      window.removeEventListener('contextmenu', blockContext)
    }
  }, [])
}
