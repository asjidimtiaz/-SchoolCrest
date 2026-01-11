import { supabaseServer } from './supabaseServer'

export interface Team {
  id: string
  name: string
  gender: string
  sport_category: string
  photo_url: string | null
  media_type?: 'image' | 'video'
  head_coach?: string
  school_id: string
}

export interface TeamSeason {
  id: string
  team_id: string
  year: number
  record: string
  coach: string
  achievements: string[]
  individual_accomplishments?: string
  summary?: string
  photo_url?: string | null
  roster: any // JSONB
}

export async function getTeams(schoolId: string): Promise<Team[]> {
  try {
    const { data, error } = await supabaseServer
      .from('teams')
      .select('*')
      .eq('school_id', schoolId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching Teams:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getTeams:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getTeam(teamId: string): Promise<Team | null> {
  try {
    const { data, error } = await supabaseServer
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (error) {
      console.error('Error fetching Team:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('FATAL in getTeam:', err instanceof Error ? err.message : err)
    return null
  }
}

export async function getTeamSeasons(teamId: string): Promise<TeamSeason[]> {
  try {
    const { data, error } = await supabaseServer
      .from('team_seasons')
      .select('*')
      .eq('team_id', teamId)
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching Team Seasons:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getTeamSeasons:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getTeamsWithLatestSeason(schoolId: string): Promise<(Team & { latestSeason?: TeamSeason | null })[]> {
  try {
    const teams = await getTeams(schoolId)
    
    // Fetch latest season for each team
    const teamsWithSeason = await Promise.all(teams.map(async (team) => {
      const { data: seasons, error } = await supabaseServer
        .from('team_seasons')
        .select('*')
        .eq('team_id', team.id)
        .order('year', { ascending: false })
        .limit(1)

      if (error) {
        console.error(`Error fetching latest season for team ${team.id}:`, error.message)
        return { ...team, latestSeason: null }
      }

      return {
        ...team,
        latestSeason: seasons?.[0] || null
      }
    }))

    return teamsWithSeason
  } catch (err) {
    console.error('FATAL in getTeamsWithLatestSeason:', err)
    return []
  }
}

export interface TeamSeasonWithTeam extends TeamSeason {
  team: Team
}

export async function getAllTeamSeasons(schoolId: string): Promise<TeamSeasonWithTeam[]> {
  try {
    // 1. Get all teams for the school first
    const { data: teams, error: teamsError } = await supabaseServer
      .from('teams')
      .select('*')
      .eq('school_id', schoolId)
      
    if (teamsError || !teams) {
      console.error('Error fetching teams for seasons:', teamsError?.message)
      return []
    }

    // 2. Get all seasons for these teams
    // optimize: separate query or join. Supabase JS 'select(*, teams!inner(*))' is better but strict typing can be tricky.
    // Let's try the join syntax if relation is established, else manual map.
    // Assuming standard resizing logic, simple join:
    const { data: seasons, error: seasonsError } = await supabaseServer
      .from('team_seasons')
      .select(`
        *,
        team:teams!inner(*)
      `)
      .eq('team.school_id', schoolId)
      .order('year', { ascending: false })

    if (seasonsError) {
      // Fallback if the join fails (e.g. RLS on joined table or missing FK alias)
      console.warn('Join fetch failed, trying manual composition...', seasonsError.message)
      
      const teamIds = teams.map(t => t.id)
      const { data: rawSeasons, error: rawError } = await supabaseServer
        .from('team_seasons')
        .select('*')
        .in('team_id', teamIds)
        .order('year', { ascending: false })

      if (rawError || !rawSeasons) return []

      return rawSeasons.map(season => ({
        ...season,
        team: teams.find(t => t.id === season.team_id)!
      })).filter(s => s.team) // explicit filter for safety
    }

    return (seasons as any[]) || []
  } catch (err) {
    console.error('FATAL in getAllTeamSeasons:', err)
    return []
  }
}
