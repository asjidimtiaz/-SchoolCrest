import { getSchool } from '@/lib/getSchool'
import { getProgram, getProgramSeasons } from '@/lib/getPrograms'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Trophy } from 'lucide-react'
import ProgramForm from '../ProgramForm'
import SeasonsManager from '../SeasonsManager'

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const school = await getSchool()
    const program = await getProgram(id)
    const seasons = await getProgramSeasons(id)

    if (!school || !program) return notFound()

    return (
        <div className="pb-20 text-left max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/programs"
                    className="p-3 bg-white text-gray-400 hover:text-black hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Program History & Details</h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Program Identity & Season Archive</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Program Details Section */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-300 border border-slate-100/50">
                        <Trophy size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Program</span>
                            <div className="px-2.5 py-0.5 bg-gray-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">
                                {program.gender}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{program.name}</h2>
                    </div>
                </div>

                {/* Archive History Section */}
                <div id="seasons" className="border-t border-gray-200/60 pt-6">
                    <SeasonsManager seasons={seasons} programId={program.id} programName={program.name} schoolId={school.id} />
                </div>
            </div>
        </div>
    )
}

