'use client'

import { useState, useTransition } from 'react'
import { Team, TeamSeason } from '@/lib/getTeams'
import { Edit, Users, ChevronRight, UserPlus } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import RosterModal from './RosterModal'
import { upsertSeason } from './actions'

interface TeamWithSeason extends Team {
    latestSeason?: TeamSeason | null
}

interface TeamsAdminTableProps {
    teams: TeamWithSeason[]
}

export default function TeamsAdminTable({ teams }: TeamsAdminTableProps) {
    const [selectedTeam, setSelectedTeam] = useState<TeamWithSeason | null>(null)
    const [isRosterOpen, setIsRosterOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleOpenRoster = async (team: TeamWithSeason) => {
        if (team.latestSeason) {
            setSelectedTeam(team)
            setIsRosterOpen(true)
        } else {
            // Create a default season for the current year
            if (!confirm(`No season found for ${team.name}. Create ${new Date().getFullYear()} season to manage roster?`)) return
            
            startTransition(async () => {
                const formData = new FormData()
                formData.append('team_id', team.id)
                formData.append('year', new Date().getFullYear().toString())
                formData.append('record', '')
                formData.append('coach', '')
                formData.append('roster', '[]')
                
                const result = await upsertSeason(null, formData)
                if (result.success) {
                    // This is a bit tricky because we're in a client component and the parent is server-rendered.
                    // We might need to refresh or just tell the user it's done.
                    // Ideally, we'd have the new season ID here.
                    // Let's assume the user will just click it again or we can have a more robust way.
                    window.location.reload()
                } else {
                    alert(result.error || 'Failed to create season')
                }
            })
        }
    }

    return (
        <>
            <div className="glass-card rounded-2xl overflow-hidden border-none text-[13px] shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Program Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/30">
                            {teams.map((team) => {
                                const playerCount = Array.isArray(team.latestSeason?.roster) ? team.latestSeason.roster.length : 0
                                
                                return (
                                    <tr key={team.id} className="hover:bg-white/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shadow-soft flex items-center justify-center text-gray-300 flex-shrink-0">
                                                    {team.photo_url ? (
                                                        <img src={team.photo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users size={20} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-base font-black text-gray-900 block truncate">
                                                        {team.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                        {team.gender} 
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                       
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/admin/teams/${team.id}#seasons`}
                                                    className="flex items-center gap-1.5 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="View Program Seasons"
                                                >
                                                    <ChevronRight size={14} strokeWidth={3} />
                                                    View Seasons
                                                </Link>
                                                <Link 
                                                    href={`/admin/teams/${team.id}/edit`}
                                                    className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                                                    title="Edit Team"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <DeleteButton id={team.id} type="team" />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isRosterOpen && selectedTeam && selectedTeam.latestSeason && (
                <RosterModal 
                    seasonId={selectedTeam.latestSeason.id}
                    teamId={selectedTeam.id}
                    teamName={selectedTeam.name}
                    seasonYear={selectedTeam.latestSeason.year}
                    initialRoster={selectedTeam.latestSeason.roster}
                    onClose={() => setIsRosterOpen(false)}
                />
            )}
        </>
    )
}
