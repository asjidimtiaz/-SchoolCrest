'use client'

import { useBranding } from '@/context/BrandingContext'
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'
import ProgramsGrid from '@/components/Programs/ProgramsGrid'
import BackButton from '@/components/BackButton'

import { ProgramSeasonWithProgram } from '@/lib/getPrograms'

export default function ProgramsContent({ seasons }: { seasons: ProgramSeasonWithProgram[] }) {
    const branding = useBranding()

    return (
        <main className="min-h-screen flex flex-col relative">
            <BrandingBackground />
            <KioskHeader pageTitle={branding.navTeamsLabel} />

            <div className="flex-1 max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col pt-0">
                {/* Grid Container */}
                <div className="w-full flex-1 pb-32">
                    <ProgramsGrid seasons={seasons} />
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
