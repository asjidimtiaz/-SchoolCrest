import { getSchool } from '@/lib/getSchool'
import ProgramForm from '../ProgramForm'

export default async function NewProgramPage() {
  const school = await getSchool()
  if (!school) return null

  return (
    <div className="animate-fade-in text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Add New Program</h1>
        <p className="text-gray-500 mt-1">Create a new program entry</p>
      </div>

      <ProgramForm schoolId={school.id} />
    </div>

  )
}
