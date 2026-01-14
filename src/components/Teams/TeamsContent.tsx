'use client'

import { useBranding } from '@/context/BrandingContext'
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'
import TeamsGrid from '@/components/Teams/TeamsGrid'
import BackButton from '@/components/BackButton'

import { TeamSeasonWithTeam } from '@/lib/getTeams'

export default function TeamsContent({ seasons }: { seasons: TeamSeasonWithTeam[] }) {
    const branding = useBranding()
    
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
             <BrandingBackground />
             <KioskHeader pageTitle={branding.navTeamsLabel} />

            <div className="flex-1 max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col pt-0 overflow-y-auto custom-scrollbar">
                {/* Grid Container */}
                <div className="w-full flex-1 pb-32">
                    <TeamsGrid seasons={seasons} />
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
