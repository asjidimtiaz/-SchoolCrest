import { getSchool } from '@/lib/getSchool'
import { getProgram } from '@/lib/getPrograms'
import ProgramForm from '../../ProgramForm'
import { notFound } from 'next/navigation'

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  const program = await getProgram(id)

  if (!school || !program) return notFound()

  return (
    <div className="animate-fade-in text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Edit {program.name}</h1>
        <p className="text-gray-500 mt-1">Update program details</p>
      </div>

      <ProgramForm schoolId={school.id} program={program} isEdit={true} />
    </div>

  )
}
