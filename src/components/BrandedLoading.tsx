'use client';

import { useBranding } from '@/context/BrandingContext';

export default function BrandedLoading() {
  const { logoUrl, name, primaryColor } = useBranding();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer Spinner Ring (Partial Arc) */}
        <div 
          className="w-32 h-32 border-[6px] border-transparent rounded-full animate-spin"
          style={{ borderTopColor: primaryColor }}
        />
        
        {/* Core Logo Container */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={name} 
              className="w-16 h-16 object-contain animate-pulse-subtle"
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full opacity-20"
              style={{ backgroundColor: primaryColor }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
