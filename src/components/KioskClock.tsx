'use client'

import { useState, useEffect } from 'react'

export default function KioskClock() {
  const [date, setDate] = useState<Date | null>(null)

  useEffect(() => {
    setDate(new Date())
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!date) return null // Prevent hydration mismatch

  return (
    <div className="flex items-center gap-4 text-white">
      <div className="text-lg font-bold tracking-wide font-mono">
        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="h-4 w-px bg-white/30" />
      <div className="text-sm font-medium">
        {date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  )
}
