'use client'

import { BrandingProvider } from '@/context/BrandingContext'

export default function BrandingProviderWrapper({ 
    children, 
    branding 
}: { 
    children: React.ReactNode
    branding: any 
}) {
    return (
        <BrandingProvider branding={branding}>
            {children}
        </BrandingProvider>
    )
}
