'use client'

import { useBranding } from '@/context/BrandingContext'
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'
import FullScreenToggle from './FullScreenToggle'

interface KioskHeaderProps {
  pageTitle?: string
}

export default function KioskHeader({ pageTitle }: KioskHeaderProps = {}) {
  const branding = useBranding()

  return (
    <header className="sticky top-0 shrink-0 z-50 bg-gray-100">
      {/* Main Header with Gradient */}
      <div 
        className="px-8 lg:px-16 py-2 flex items-center justify-between shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10" />
        
        <Link 
          href="/home"
          className="flex items-center gap-4 relative z-10 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer group"
        >
          {/* Logo Container */}
          <div className="relative">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.name} 
                className="h-16 w-16 object-cover rounded-full drop-shadow-lg bg-white/10 p-1 group-hover:bg-white/20 transition-colors" 
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 group-hover:bg-white/30 transition-colors"
              >
                <GraduationCap size={44} strokeWidth={2} className="text-white" />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg group-hover:translate-x-0.5 transition-transform">
              {branding.name}
            </h1>
            {branding.tagline && (
              <p className="text-xs font-semibold tracking-wide mt-0.5 text-white/90 drop-shadow-md">
                {branding.tagline}
              </p>
            )}
          </div>
        </Link>

        {/* Action Buttons & Title */}
        <div className="flex items-center gap-6 relative z-10">
          {pageTitle && (
            <h2 className="text-3xl font-black italic text-white tracking-tight uppercase drop-shadow-lg hidden md:block">
              {pageTitle}
            </h2>
          )}
          <FullScreenToggle />
        </div>
      </div>
      
      {/* Bottom accent line - using branding.accentColor for rich detail */}
      <div 
        className="h-1 opacity-80" 
        style={{ 
          background: `linear-gradient(90deg, transparent 0%, ${branding.accentColor} 50%, transparent 100%)` 
        }} 
      />
    </header>
  )
}
