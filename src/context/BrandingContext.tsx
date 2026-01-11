'use client'

import { createContext, useContext, useMemo } from 'react'

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
  const value = useMemo(() => branding, [
    branding.name,
    branding.logoUrl,
    branding.tagline,
    branding.primaryColor,
    branding.secondaryColor,
    branding.accentColor,
    branding.backgroundUrl,
    branding.backgroundType
  ])

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider')
  }

  const sanitize = (url?: string) => (url?.startsWith('blob:') ? '' : url)

  // Safe Defaults for production stability
  return {
    ...context,
    logoUrl: sanitize(context.logoUrl),
    backgroundUrl: sanitize(context.backgroundUrl),
    primaryColor: context.primaryColor || '#000000',
    secondaryColor: context.secondaryColor || '#ffffff',
    accentColor: context.accentColor || '#3b82f6',
    name: context.name || 'School Crest Kiosk',
  }
}
