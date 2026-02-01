'use client'

import { useState, useTransition } from 'react'
import { Program, ProgramSeason } from '@/lib/getPrograms'
import { Edit, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import RosterModal from './RosterModal'
import { upsertSeason } from './actions'

interface ProgramWithSeason extends Program {
    latestSeason?: ProgramSeason | null
}

interface ProgramsAdminTableProps {
    programs: ProgramWithSeason[]
}

export default function ProgramsAdminTable({ programs }: ProgramsAdminTableProps) {
    const [selectedProgram, setSelectedProgram] = useState<ProgramWithSeason | null>(null)
    const [isRosterOpen, setIsRosterOpen] = useState(false)
    const [isPending, startTransition] = useTransition()


    const handleOpenRoster = async (program: ProgramWithSeason) => {
        if (program.latestSeason) {
            setSelectedProgram(program)
            setIsRosterOpen(true)
        } else {
            // Create a default season for the current year
            if (!confirm(`No season found for ${program.name}. Create ${new Date().getFullYear()} season to manage roster?`)) return

            startTransition(async () => {
                const formData = new FormData()
                formData.append('program_id', program.id)
                formData.append('year', new Date().getFullYear().toString())
                formData.append('record', '')
                formData.append('coach', '')
                formData.append('roster', '[]')

                const result = await upsertSeason(null, formData)
                if (result.success) {
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
                            {programs.map((program, index) => {
                                return (
                                    <tr key={program.id && program.id !== 'null' ? program.id : `program-fallback-${index}`} className="hover:bg-white/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shadow-soft flex items-center justify-center text-gray-300 flex-shrink-0">
                                                    {program.photo_url ? (
                                                        <img src={program.photo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users size={20} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-base font-black text-gray-900 block truncate">
                                                        {program.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                        {program.gender}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={program.id && program.id !== 'null' ? `/admin/programs/${program.id}#seasons` : '#'}
                                                    onClick={(e) => {
                                                        if (!program.id || program.id === 'null') {
                                                            e.preventDefault();
                                                            alert('This program entry is corrupted (missing ID) and cannot be viewed.');
                                                        }
                                                    }}
                                                    className={`flex items-center gap-1.5 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-xl transition-all shadow-sm ${!program.id || program.id === 'null' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white'}`}
                                                    title="View Program Seasons"
                                                >
                                                    <ChevronRight size={14} strokeWidth={3} />
                                                    View Seasons
                                                </Link>
                                                <Link
                                                    href={`/admin/programs/${program.id}/edit`}
                                                    className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                                                    title="Edit Program"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <DeleteButton id={program.id} type="program" />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isRosterOpen && selectedProgram && selectedProgram.latestSeason && (
                <RosterModal
                    seasonId={selectedProgram.latestSeason.id}
                    programId={selectedProgram.id}
                    programName={selectedProgram.name}
                    seasonYear={selectedProgram.latestSeason.year}
                    initialRoster={selectedProgram.latestSeason.roster}
                    onClose={() => setIsRosterOpen(false)}
                />
            )}
        </>
    )
}
