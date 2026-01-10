'use client'

import { useBranding } from '@/context/BrandingContext'
import { GraduationCap } from 'lucide-react'

interface KioskHeaderProps {
  pageTitle?: string
}

export default function KioskHeader({ pageTitle }: KioskHeaderProps = {}) {
  const branding = useBranding()

  return (
    <header className="sticky top-0 shrink-0 z-10 bg-gray-100">
      {/* Main Header with Gradient */}
      <div 
        className="px-16 py-3 flex items-center justify-between shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10" />
        
        <div className="flex items-center gap-5 relative z-10">
          {/* Logo Container */}
          <div className="relative">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.name} 
                className="h-12 w-12 object-cover rounded-full drop-shadow-lg bg-white/10 p-1" 
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg border border-white/30"
              >
                <GraduationCap size={32} strokeWidth={2} className="text-white" />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg">
              {branding.name}
            </h1>
            {branding.tagline && (
              <p className="text-xs font-semibold tracking-wide mt-0.5 text-white/90 drop-shadow-md">
                {branding.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Page Title on Right */}
        {pageTitle && (
          <div className="flex items-center relative z-10">
            <h2 className="text-3xl font-black italic text-white tracking-tight uppercase drop-shadow-lg">
              {pageTitle}
            </h2>
          </div>
        )}
      </div>
      
      {/* Bottom accent line - subtle shimmer effect */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </header>
  )
}
