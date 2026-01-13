import { getSchool } from '@/lib/getSchool'
import { getTeams, getTeamYears } from '@/lib/getTeams'
import TeamsContent from '@/components/Teams/TeamsContent'

export default async function TeamsPage() {
  const school = await getSchool();
  
  if (!school) return null;

  const teams = await getTeams(school.id);
  const teamYears = await getTeamYears(school.id);

  return <TeamsContent teams={teams} teamYears={teamYears} />;
}
