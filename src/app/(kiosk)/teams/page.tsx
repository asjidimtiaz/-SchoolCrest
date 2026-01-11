import { getSchool } from '@/lib/getSchool'
import { getAllTeamSeasons } from '@/lib/getTeams'
import TeamsGrid from '@/components/Teams/TeamsGrid'
import BackButton from '@/components/BackButton'
import BrandingProviderWrapper from '@/components/BrandingProviderWrapper'
import { Trophy } from 'lucide-react'

export default async function TeamsPage() {
  const school = await getSchool();
  
  if (!school) return null;

  const seasons = await getAllTeamSeasons(school.id);

  // Construct branding object (Consistent with HallOfFamePage)
  const branding = {
    name: school.name,
    logoUrl: school.logo_url,
    tagline: school.tagline,
    primaryColor: school.primary_color || '#000000',
    secondaryColor: school.secondary_color || '#ffffff',
    accentColor: school.accent_color || '#3b82f6',
    backgroundUrl: school.background_url,
    backgroundType: school.background_type as 'image' | 'video'
  }

  return (
    <BrandingProviderWrapper branding={branding}>
    <InternalTeamsPage seasons={seasons} branding={branding} />
    </BrandingProviderWrapper>
  );
}

import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'

function InternalTeamsPage({ seasons, branding }: { seasons: any[], branding: any }) {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
             <BrandingBackground />
             <KioskHeader pageTitle="Team Histories" />

            <div className="flex-1 max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col pt-0 overflow-y-auto custom-scrollbar">
                {/* Grid Container */}
                <div className="w-full flex-1 pb-32">
                    <TeamsGrid initialData={seasons} />
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
