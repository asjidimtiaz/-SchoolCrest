'use client'

import { useState } from 'react'
import { User, Users } from 'lucide-react'

interface InducteePhotoProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'lg'
  className?: string
}

export default function InducteePhoto({ src, name, size = 'sm', className = '' }: InducteePhotoProps) {
  const [hasError, setHasError] = useState(false)

  const isLarge = size === 'lg'
  const containerClasses = isLarge 
    ? 'w-24 h-24 rounded-2xl' 
    : 'w-9 h-9 rounded-xl'
  
  const iconSize = isLarge ? 32 : 16

  if (!src || hasError) {
    return (
      <div className={`${containerClasses} bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 shadow-soft ${className}`}>
        {isLarge ? <User size={iconSize} /> : <Users size={iconSize} />}
      </div>
    )
  }

  return (
    <div className={`${containerClasses} bg-gray-50 border border-gray-100 overflow-hidden shadow-soft shrink-0 ${className}`}>
      <img 
        src={src} 
        alt={name || 'Inductee'} 
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
