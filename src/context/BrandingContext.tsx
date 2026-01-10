'use client'

import { createContext, useContext } from 'react'

type Branding = {
  name: string
  logoUrl?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundUrl?: string
  backgroundType?: 'image' | 'video'
}

const BrandingContext = createContext<Branding | null>(null)

export function BrandingProvider({
  branding,
  children,
}: {
  branding: Branding
  children: React.ReactNode
}) {
  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider')
  }

  // Safe Defaults for production stability
  return {
    ...context,
    primaryColor: context.primaryColor || '#000000',
    secondaryColor: context.secondaryColor || '#ffffff',
    accentColor: context.accentColor || '#3b82f6',
    name: context.name || 'School Crest Kiosk',
    backgroundUrl: context.backgroundUrl || '',
    backgroundType: context.backgroundType || 'image',
  }
}
