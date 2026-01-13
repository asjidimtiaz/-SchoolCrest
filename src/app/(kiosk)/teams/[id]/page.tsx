import { getSchool } from '@/lib/getSchool'
import { getTeam, getTeamSeasons } from '@/lib/getTeams'
import TeamDetailContent from '@/components/Teams/TeamDetailContent'

export default async function TeamDetailPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ id: string }>, 
    searchParams: Promise<{ season?: string }> 
}) {
  const { id } = await params
  const { season: seasonYear } = await searchParams
  
  const school = await getSchool()
  const team = await getTeam(id)
  const allSeasons = await getTeamSeasons(id)

  if (!school || !team) return <div>Team not found</div>
  
  // Filter if season param is present
  // Pass all seasons so the grid is fully populated. 
  // The 'seasonYear' prop will determine which one opens in the modal by default.
  const seasons = allSeasons;

  return (
    <TeamDetailContent 
        team={team} 
        seasons={seasons} 
        seasonYear={seasonYear} 
    />
  )
}
