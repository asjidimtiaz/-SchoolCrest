import { getSchool } from '@/lib/getSchool'
import { getHallOfFame } from '@/lib/getHallOfFame'
import HallOfFameGrid from '@/components/HallOfFame/HallOfFameGrid'
import BackButton from '@/components/BackButton'
import BrandingProviderWrapper from '@/components/BrandingProviderWrapper'

export default async function HallOfFamePage() {
  const school = await getSchool()
  
  if (!school) return null

  const inductees = await getHallOfFame(school.id)

  // Construct branding object from school
  const branding = {
    name: school.name,
    logoUrl: school.logo_url,
    tagline: school.tagline,
    primaryColor: school.primary_color || '#000000',
    secondaryColor: school.secondary_color || '#ffffff',
    accentColor: school.accent_color || '#3b82f6', // Ensure this exists in your type or schema
    backgroundUrl: school.background_url,
    backgroundType: school.background_type as 'image' | 'video'
  }

  return (
    <BrandingProviderWrapper branding={branding}>
       <InternalHallOfFamePage inductees={inductees} branding={branding} />
    </BrandingProviderWrapper>
  );
}

// Separate component to use client-side hooks easily if needed, 
// though we are passing branding prop for server rendering style injection
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'

// ...

function InternalHallOfFamePage({ inductees, branding }: { inductees: any[], branding: any }) {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
            <BrandingBackground />
            <KioskHeader pageTitle="Hall of Fame Legends" />

            <div className="flex-1 max-w-7xl mx-auto px-8 w-full relative z-20 flex flex-col pt-0 overflow-y-auto custom-scrollbar">
                {/* Content Wrapper */}
                <div className="w-full flex-1 pb-32">
                    <HallOfFameGrid initialData={inductees} />
                </div>
            </div>

            {/* Centered Bottom Back Button */}
            <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="pointer-events-auto active:scale-95 transition-all duration-200">
                    <BackButton label="Back to Menu" className="px-10 py-3.5 text-sm font-black shadow-[0_15px_30px_rgba(0,0,0,0.12)] bg-white text-slate-900 border border-gray-100 rounded-full" />
                </div>
            </div>
        </main>
    )
}
