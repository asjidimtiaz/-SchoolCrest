'use client'

import { useBranding } from '@/context/BrandingContext'

export default function BrandingBackground() {
  const branding = useBranding()

  // 1. If we have a custom background URL (video/image)
  if (branding.backgroundUrl) {
    return (
      <>
        {branding.backgroundType === 'video' ? (
          <video
            src={branding.backgroundUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{ zIndex: 0 }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${branding.backgroundUrl})`,
              zIndex: 0,
            }}
          />
        )}
        {/* Professional Cinematic Overlay */}
        
        {/* 1. Brand Tint (Color Grading) - 'multiply' blends color naturally into video */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none" 
          style={{ 
            backgroundColor: branding.primaryColor,
            mixBlendMode: 'multiply',
            opacity: 0.8
          }} 
        />

        {/* 2. Text Legibility Vignette (Top/Bottom Subtle Darkening) */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </>
    )
  }

  // 2. Fallback Pattern (if no background media)
  return (
    <div className="absolute inset-0 z-0" style={{ backgroundColor: branding.primaryColor || '#f8fafc' }}>
        <div className="absolute inset-0 bg-white/90" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
            <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
    </div>
  )
}
