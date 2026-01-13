import { getSchool } from '@/lib/getSchool'
import { getScreensaverImages } from '@/lib/getScreensaverImages'
import InfoContent from '@/components/Info/InfoContent'

export default async function InfoPage() {
  const school = await getSchool()
  
  if (!school) return null

  const galleryImages = await getScreensaverImages(school.id)

  return <InfoContent school={school} galleryImages={galleryImages} />;
}
