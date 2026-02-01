import { supabasePublic } from './supabaseServer'

export interface Program {
  id: string
  name: string
  gender: string
  sport_category: string
  photo_url: string | null
  background_url: string | null
  media_type?: 'image' | 'video'
  head_coach?: string
  school_id: string
}

export interface ProgramSeason {
  id: string
  team_id: string
  year: number
  record: string
  coach: string
  achievements: string[]
  individual_accomplishments?: string
  summary?: string
  photo_url?: string | null
  media_type?: 'image' | 'video'
  roster: any // JSONB
}

export async function getPrograms(schoolId: string): Promise<Program[]> {
  try {
    const { data, error } = await supabasePublic
      .from('teams')
      .select('*')
      .eq('school_id', schoolId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching Programs:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getPrograms:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getProgram(programId: string): Promise<Program | null> {
  if (!programId || programId === 'null' || programId === 'undefined') return null
  try {
    const { data, error } = await supabasePublic
      .from('teams')
      .select('*')
      .eq('id', programId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching Program:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('FATAL in getProgram:', err instanceof Error ? err.message : err)
    return null
  }
}

export async function getProgramSeasons(programId: string): Promise<ProgramSeason[]> {
  if (!programId || programId === 'null' || programId === 'undefined') return []
  try {
    const { data, error } = await supabasePublic
      .from('team_seasons')
      .select('*')
      .eq('team_id', programId)
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching Program Seasons:', error.message)
      return []
    }

    return data || []
  } catch (err) {
    console.error('FATAL in getProgramSeasons:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getProgramsWithLatestSeason(schoolId: string): Promise<(Program & { latestSeason?: ProgramSeason | null })[]> {
  try {
    const programs = await getPrograms(schoolId)

    // Fetch latest season for each program
    const programsWithSeason = await Promise.all(programs.map(async (program) => {
      const { data: seasons, error } = await supabasePublic
        .from('team_seasons')
        .select('*')
        .eq('team_id', program.id)
        .order('year', { ascending: false })
        .limit(1)

      if (error) {
        console.error(`Error fetching latest season for program ${program.id}:`, error.message)
        return { ...program, latestSeason: null }
      }

      return {
        ...program,
        latestSeason: seasons?.[0] || null
      }
    }))

    return programsWithSeason
  } catch (err) {
    console.error('FATAL in getProgramsWithLatestSeason:', err)
    return []
  }
}

export interface ProgramSeasonWithProgram extends ProgramSeason {
  program: Program
}

export async function getAllProgramSeasons(schoolId: string): Promise<ProgramSeasonWithProgram[]> {
  try {
    // 1. Get all programs for the school first
    const { data: programs, error: programsError } = await supabasePublic
      .from('teams')
      .select('*')
      .eq('school_id', schoolId)

    if (programsError || !programs || programs.length === 0) {
      if (programsError) console.error('Error fetching programs for seasons:', programsError.message)
      return []
    }

    // 2. Efficiently fetch all seasons for these programs using their IDs
    // We avoid the join here because of the reported relationship/schema cache issues
    const programIds = programs.map(p => p.id)
    const { data: seasons, error: seasonsError } = await supabasePublic
      .from('team_seasons')
      .select('*')
      .in('team_id', programIds)
      .order('year', { ascending: false })

    if (seasonsError || !seasons) {
      console.error('Error fetching seasons for composition:', seasonsError?.message)
      return []
    }

    // 3. Manually compose the data
    return seasons.map(season => {
      const program = programs.find(p => p.id === season.team_id)
      return {
        ...season,
        program: program!
      }
    }).filter(s => s.program) // Ensure every season has a program
  } catch (err) {
    console.error('FATAL in getAllProgramSeasons:', err)
    return []
  }
}

export async function getProgramYears(schoolId: string): Promise<{ program_id: string; year: number }[]> {
  try {
    const { data: programs, error: programsError } = await supabasePublic
      .from('teams')
      .select('id')
      .eq('school_id', schoolId)

    if (programsError || !programs || programs.length === 0) {
      return []
    }

    const programIds = programs.map(p => p.id)

    const { data: seasons, error: seasonsError } = await supabasePublic
      .from('team_seasons')
      .select('team_id, year')
      .in('team_id', programIds)
      .order('year', { ascending: false })

    if (seasonsError) {
      console.error('Error fetching Program Years:', seasonsError.message)
      return []
    }

    // Map team_id to program_id for consistency with the new naming
    return seasons?.map(s => ({ program_id: s.team_id, year: s.year })) || []
  } catch (err) {
    console.error('FATAL in getProgramYears:', err)
    return []
  }
}
