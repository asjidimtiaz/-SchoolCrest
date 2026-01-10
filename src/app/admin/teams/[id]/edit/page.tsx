import { getSchool } from '@/lib/getSchool'
import { getTeam } from '@/lib/getTeams'
import TeamForm from '../../TeamForm'
import { notFound } from 'next/navigation'

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  const team = await getTeam(id)

  if (!school || !team) return notFound()

  return (
    <div className="animate-fade-in text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Edit {team.name}</h1>
        <p className="text-gray-500 mt-1">Update team details</p>
      </div>

      <TeamForm schoolId={school.id} team={team} isEdit={true} />
    </div>

  )
}
