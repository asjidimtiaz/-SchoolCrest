import { getSchool } from '@/lib/getSchool'
import { getProgramsWithLatestSeason } from '@/lib/getPrograms'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import ProgramsAdminTable from './ProgramsAdminTable'

export default async function ProgramsAdminPage() {
  const school = await getSchool()
  if (!school) return null

  const programs = await getProgramsWithLatestSeason(school.id)

  return (
    <div className="space-y-6 pb-4 animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-full border border-blue-100">Programs</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ALL PROGRAMS</h1>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Manage sports programs, seasonal records, and player rosters.</p>
        </div>
        <Link
          href="/admin/programs/new"
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg text-[11px] uppercase tracking-widest"
        >
          <Plus size={16} />
          Add New Program
        </Link>
      </div>

      <ProgramsAdminTable programs={programs} />

      {programs.length === 0 && (
        <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-100 shadow-soft">
          <div className="flex flex-col items-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-4 border border-gray-100">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">No Programs Found</h3>
            <p className="text-gray-400 text-[11px] font-medium leading-relaxed uppercase tracking-widest text-center">
              Get started by adding your first athletic program.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
