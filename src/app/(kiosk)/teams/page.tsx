import { getSchool } from '@/lib/getSchool'
import { getAllTeamSeasons } from '@/lib/getTeams'
import TeamsContent from '@/components/Teams/TeamsContent'

export default async function TeamsPage() {
  const school = await getSchool();
  
  if (!school) return null;

  const allSeasons = await getAllTeamSeasons(school.id);

  return <TeamsContent seasons={allSeasons} />;
}
