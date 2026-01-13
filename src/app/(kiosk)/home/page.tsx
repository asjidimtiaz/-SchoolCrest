import { getSchool } from '@/lib/getSchool'
import HomeContent from '@/components/Home/HomeContent'

export default async function Home() {
  const school = await getSchool()
  
  if (!school) return null

  return <HomeContent />
}
