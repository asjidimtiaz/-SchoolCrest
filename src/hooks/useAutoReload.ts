'use client'

import { useEffect } from 'react'

export default function useAutoReload() {
  useEffect(() => {
    const timer = setTimeout(() => {
      location.reload()
    }, 1000 * 60 * 60 * 6) // 6 hours

    return () => clearTimeout(timer)
  }, [])
}
