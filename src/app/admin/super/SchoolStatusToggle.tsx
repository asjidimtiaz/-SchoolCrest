'use client'

// Force refresh
import { useState, useTransition } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toggleSchoolStatus } from './actions'

export default function SchoolStatusToggle({ 
  schoolId, 
  currentStatus 
}: { 
  schoolId: string
  currentStatus: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [isActive, setIsActive] = useState(currentStatus)

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = !isActive
      setIsActive(newStatus)
      await toggleSchoolStatus(schoolId, newStatus)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      }`}
      title={isActive ? 'Deactivate School' : 'Activate School'}
    >
      {isActive ? <Eye size={18} /> : <EyeOff size={18} />}
      <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
    </button>
  )
}
