import { getSchool } from '@/lib/getSchool'
import { getHallOfFame } from '@/lib/getHallOfFame'
import HallOfFameContent from '@/components/HallOfFame/HallOfFameContent'

export default async function HallOfFamePage() {
  const school = await getSchool()
  
  if (!school) return null

  const inductees = await getHallOfFame(school.id)

  return <HallOfFameContent inductees={inductees} />;
}
