import { getSchool } from '@/lib/getSchool'
import BrandingProviderWrapper from '@/components/BrandingProviderWrapper'
import HomeContent from '@/components/Home/HomeContent'

export default async function Home() {
  const school = await getSchool()
  
  if (!school) return null

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
       <HomeContent />
    </BrandingProviderWrapper>
  )
}
