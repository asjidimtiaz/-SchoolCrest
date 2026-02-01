import { getSchool } from '@/lib/getSchool'
import { getProgram, getProgramSeasons } from '@/lib/getPrograms'
import ProgramDetailContent from '@/components/Programs/ProgramDetailContent'

export default async function ProgramDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ season?: string }>
}) {
  const { id } = await params
  const { season: seasonYear } = await searchParams

  const school = await getSchool()
  const program = await getProgram(id)
  const allSeasons = await getProgramSeasons(id)

  if (!school || !program) return <div>Program not found</div>

  // Filter if season param is present
  // Pass all seasons so the grid is fully populated. 
  // The 'seasonYear' prop will determine which one opens in the modal by default.
  const seasons = allSeasons;

  return (
    <ProgramDetailContent
      program={program}
      seasons={seasons}
      seasonYear={seasonYear}
    />
  )
}
