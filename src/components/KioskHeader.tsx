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
        className="px-8 lg:px-16 py-1 flex items-center justify-between shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)`
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10" />

        <Link
          href="/home"
          className="flex items-center gap-4 relative z-10 active:scale-[0.98] transition-all cursor-pointer group"
        >
          {/* Logo Container */}
          <div className="relative">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.name}
                className="h-12 w-12 lg:h-14 lg:w-14 object-contain rounded-xl drop-shadow-xl bg-white p-1 transition-colors my-2"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg border border-white/30 transition-colors"
              >
                <GraduationCap size={28} strokeWidth={2} className="text-white" />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg group-hover:translate-x-0.5 transition-transform">
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

      {/* Bottom accent line - solid color */}
      <div
        className="h-1"
        style={{
          backgroundColor: branding.accentColor
        }}
      />
    </header>
  )
}
