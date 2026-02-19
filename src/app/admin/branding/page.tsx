import BrandingForm from './BrandingForm'
import { getSchool } from '@/lib/getSchool'
import { getScreensaverImages } from '@/lib/getScreensaverImages'

export const dynamic = 'force-dynamic'

export default async function BrandingAdminPage() {
    const school = await getSchool()
    if (!school) return null

    const galleryImages = await getScreensaverImages(school.id)

    const cleanSchool = JSON.parse(JSON.stringify(school));
    const cleanGallery = JSON.parse(JSON.stringify(galleryImages));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 rounded-full text-[7px] font-black uppercase tracking-widest text-blue-500">Visual Identity</span>
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kiosk Branding</h1>
                <p className="text-sm text-gray-500 font-medium">Customize logos, colors, and background media</p>
            </div>

            <BrandingForm school={cleanSchool} galleryImages={cleanGallery} />
        </div>
    )
}
