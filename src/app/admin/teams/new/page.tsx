import { getSchool } from '@/lib/getSchool'
import TeamForm from '../TeamForm'

export default async function NewTeamPage() {
  const school = await getSchool()
  if (!school) return null

  return (
    <div className="animate-fade-in text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">New Team</h1>
        <p className="text-gray-500 mt-1">Create a new sports team entry</p>
      </div>

      <TeamForm schoolId={school.id} />
    </div>

  )
}
