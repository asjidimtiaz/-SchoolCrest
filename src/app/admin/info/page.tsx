import SchoolInfoForm from './SchoolInfoForm'
import { getSchool } from '@/lib/getSchool'

export const dynamic = 'force-dynamic'

export default async function SchoolInfoAdminPage() {
  const school = await getSchool()
  if (!school) return null

  const cleanSchool = JSON.parse(JSON.stringify(school));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[7px] font-black uppercase tracking-widest text-gray-500">Core Identity</span>
          <div className="w-1 h-1 rounded-full bg-blue-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">School Information</h1>
        <p className="text-sm text-gray-500 font-medium">Manage your institution's public profile and contact details</p>
      </div>

      <SchoolInfoForm school={cleanSchool} />
    </div>
  )
}
