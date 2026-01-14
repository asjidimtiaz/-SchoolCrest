import { getSchool } from '@/lib/getSchool'
import { getTeam, getTeamSeasons } from '@/lib/getTeams'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Trophy, User } from 'lucide-react'
import TeamForm from '../TeamForm'
import SeasonForm from '../SeasonForm'
import SeasonsManager from '../SeasonsManager'

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const school = await getSchool()
  const team = await getTeam(id)
  const seasons = await getTeamSeasons(id)

  if (!school || !team) return notFound()

   return (
    <div className="pb-20 text-left max-w-[1600px] mx-auto">
       <div className="flex items-center gap-4 mb-8">
            <Link 
                href="/admin/teams"
                className="p-3 bg-white text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
            >
                <ChevronLeft size={20} />
            </Link>
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Program History & Details</h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Program Identity & Season Archive</p>
            </div>
       </div>

       <div className="space-y-12">
            {/* Program Details Section */}
            <div>
                <TeamForm team={team} schoolId={school.id} isEdit={true} />
            </div>

            {/* Archive History Section */}
            <div id="seasons" className="border-t border-gray-200/60 pt-12">
                 <SeasonsManager seasons={seasons} teamId={team.id} teamName={team.name} schoolId={school.id} />
            </div>
       </div>
    </div>
  )
}

