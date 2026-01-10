import { getSchool } from '@/lib/getSchool'
import InducteeForm from '../form'

export default async function NewInducteePage() {
  const school = await getSchool()
  if (!school) return null

  return (
    <div>
        <h1 className="text-3xl font-black text-gray-900 mb-8">Add New Inductee</h1>
        <InducteeForm schoolId={school.id} />
    </div>
  )
}
