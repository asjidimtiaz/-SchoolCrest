import BrandingForm from './BrandingForm'

export const dynamic = 'force-dynamic'

export default async function SchoolInfoAdminPage() {
  const school = await getSchool()
  if (!school) return null

  const galleryImages = await getScreensaverImages(school.id) // Fetch Gallery Images

  console.log('[InfoPage] School:', school ? 'Found' : 'Null');
  console.log('[InfoPage] GalleryImages:', galleryImages);

  // Sanitize data to ensure no serialization issues (e.g. Dates, hidden props)
  const cleanSchool = JSON.parse(JSON.stringify(school));
  const cleanGallery = JSON.parse(JSON.stringify(galleryImages));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[7px] font-black uppercase tracking-widest text-gray-500">Global Config</span>
          <div className="w-1 h-1 rounded-full bg-blue-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">School Info & Branding</h1>
        <p className="text-sm text-gray-500 font-medium">Customize the look and feel of your kiosk</p>
      </div>

      <BrandingForm school={cleanSchool} galleryImages={cleanGallery} />
    </div>
  )
}
