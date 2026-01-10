import { getSchool } from '@/lib/getSchool'
import { getTeam, getTeamSeasons } from '@/lib/getTeams'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Trophy, User } from 'lucide-react'
import SeasonForm from '../SeasonForm'
import SeasonsManager from '../SeasonsManager'

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  const team = await getTeam(id)
  const seasons = await getTeamSeasons(id)

  if (!school || !team) return notFound()

   return (
    <div className="pb-20 text-left">
       <div className="flex items-center gap-4 mb-12">
            <Link 
                href="/admin/teams"
                className="p-3 bg-white text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
            >
                <ChevronLeft size={20} />
            </Link>
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">{team.name}</h1>
                <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100/50">
                        {team.sport_category}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
                        {team.gender} Athletics
                    </span>
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sidebar: Add Season */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                 <div className="glass-card p-8 rounded-[2.5rem] border-none shadow-soft">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-black text-white rounded-xl shadow-lg">
                            <Plus size={18} />
                        </div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">New Season</h2>
                    </div>
                    <SeasonForm team_id={team.id} />
                 </div>
            </div>

            {/* Main: Season History */}
            <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Season History</h2>
                    <div className="h-px bg-gray-100 flex-1 mx-6" />
                </div>
                <SeasonsManager seasons={seasons} teamId={team.id} teamName={team.name} />
            </div>
       </div>
    </div>
  )
}

