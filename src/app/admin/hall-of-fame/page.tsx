import { getSchool } from '@/lib/getSchool'
import { getHallOfFame } from '@/lib/getHallOfFame'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import HallOfFameManager from './HallOfFameManager'

export default async function HallOfFameAdminPage() {
  const school = await getSchool()
  if (!school) return null

  const inductees = await getHallOfFame(school.id)

  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
            <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">Kiosk Content</span>
               <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Hall of Fame</h1>
            <p className="text-sm text-gray-500 font-medium tracking-tight">Manage your school's legacy inductees.</p>
        </div>
        <Link
            href="/admin/hall-of-fame/new"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white font-black rounded-lg hover:bg-gray-800 transition-all active:scale-95 shadow-md text-[10px] uppercase"
        >
            <Plus size={14} />
            Add Inductee
        </Link>
      </div>

      <HallOfFameManager initialInductees={inductees} />
    </div>
  )
}
