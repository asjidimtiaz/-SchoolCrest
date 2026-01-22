'use client'

import { useState, useTransition } from 'react'
import { Rocket, TestTube } from 'lucide-react'
import { toggleSchoolDemo } from './actions'

export default function SchoolDemoToggle({ 
  schoolId, 
  isDemo 
}: { 
  schoolId: string
  isDemo: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [isDemoMode, setIsDemoMode] = useState(isDemo)

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = !isDemoMode
      setIsDemoMode(newStatus)
      await toggleSchoolDemo(schoolId, newStatus)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
        isDemoMode
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      }`}
      title={isDemoMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
    >
      {isDemoMode ? <TestTube size={18} /> : <Rocket size={18} />}
      <span className="text-sm">{isDemoMode ? 'Demo' : 'Live'}</span>
    </button>
  )
}
