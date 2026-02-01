import { getSchool } from '@/lib/getSchool'
import { getAllProgramSeasons } from '@/lib/getPrograms'
import ProgramsContent from '@/components/Programs/ProgramsContent'

export default async function ProgramsPage() {
  const school = await getSchool();

  if (!school) return null;

  const allSeasons = await getAllProgramSeasons(school.id);

  return <ProgramsContent seasons={allSeasons} />;
}
