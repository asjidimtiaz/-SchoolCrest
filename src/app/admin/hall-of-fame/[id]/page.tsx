import { getSchool } from '@/lib/getSchool'
import { getHallOfFame } from '@/lib/getHallOfFame'
import InducteeForm from '../form'
import { redirect } from 'next/navigation'

export default async function EditInducteePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  if (!school) return null

  const inductees = await getHallOfFame(school.id)
  const inductee = inductees.find(i => i.id === id)

  if (!inductee) {
      redirect('/admin/hall-of-fame')
  }

  return (
    <div>
        <h1 className="text-3xl font-black text-gray-900 mb-8">Edit Inductee</h1>
        <InducteeForm schoolId={school.id} inductee={inductee} isEdit />
    </div>
  )
}
