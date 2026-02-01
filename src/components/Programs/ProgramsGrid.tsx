'use client'

import { useState, useMemo } from 'react'
import { ProgramSeasonWithProgram } from '@/lib/getPrograms'
import ProgramCard from './ProgramCard'
import { useBranding } from '@/context/BrandingContext'
import { X, Trophy, Search, ChevronDown } from 'lucide-react'

export default function ProgramsGrid({ seasons }: { seasons: ProgramSeasonWithProgram[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProgramId, setSelectedProgramId] = useState<string>('All')
    const [selectedYear, setSelectedYear] = useState<string>('All')
    const branding = useBranding()

    // Extract unique Programs
    const programsList = useMemo(() => {
        const programMap = new Map<string, string>();
        seasons.forEach(s => {
            programMap.set(s.program.id, s.program.name);
        });
        const sorted = Array.from(programMap.entries()).sort((a, b) => a[1].localeCompare(b[1]));
        return [{ id: 'All', name: 'ALL PROGRAMS' }, ...sorted.map(([id, name]) => ({ id, name }))];
    }, [seasons])

    // Extract unique years
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(seasons.map(s => s.year))).sort((a, b) => b - a)
        return ['All', ...uniqueYears]
    }, [seasons])

    const filteredSeasons = useMemo(() => {
        return seasons.filter(s => {
            const matchesSearch =
                s.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.summary && s.summary.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesProgram = selectedProgramId === 'All' || s.program.id === selectedProgramId;
            const matchesYear = selectedYear === 'All' || s.year.toString() === selectedYear;

            return matchesSearch && matchesProgram && matchesYear;
        });
    }, [seasons, searchTerm, selectedProgramId, selectedYear]);

    // Derived display data
    const gridData = useMemo(() => {
        // If a specific program is selected, show all their filtered seasons
        if (selectedProgramId !== 'All') {
            return filteredSeasons;
        }

        // If 'All' programs are selected, but a specific year is chosen, show all seasons for that year
        if (selectedYear !== 'All') {
            return filteredSeasons;
        }

        // Default view: Show one card per program (latest season only)
        const programLatest = new Map<string, ProgramSeasonWithProgram>();
        filteredSeasons.forEach(s => {
            if (!programLatest.has(s.program.id)) {
                programLatest.set(s.program.id, s);
            } else {
                const existing = programLatest.get(s.program.id)!;
                if (s.year > existing.year) {
                    programLatest.set(s.program.id, s);
                }
            }
        });
        return Array.from(programLatest.values()).sort((a, b) => a.program.name.localeCompare(b.program.name));
    }, [filteredSeasons, selectedProgramId, selectedYear]);

    return (
        <>
            {/* 🔍 Unified Search & Filter Toolbar */}
            <div className="my-6 flex justify-center sticky top-0 z-40 px-2 lg:px-0">
                <div className="bg-white/95 p-1.5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 flex items-center max-w-5xl w-full gap-0 backdrop-blur-xl">

                    {/* 1. Search Section (Flexible) */}
                    <div className="flex-1 flex items-center px-4 md:px-6 h-12">
                        <div className="text-slate-400 mr-4">
                            <Search size={22} className="opacity-60" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-900 placeholder:text-slate-400 h-full w-full"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    {/* 2. Year Filter (Select) */}
                    <div className="relative flex-shrink-0 min-w-[110px] md:min-w-[160px] h-12 flex items-center justify-center px-4 border-l border-slate-100">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-600 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0 pr-6"
                        >
                            {years.map(y => (
                                <option key={y} value={y}>
                                    {y === 'All' ? 'ANY YEAR' : y}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 pointer-events-none text-slate-400">
                            <ChevronDown size={14} strokeWidth={3} />
                        </div>
                    </div>

                    {/* 3. Program Filter (Select) */}
                    <div className="relative flex-shrink-0 min-w-[130px] md:min-w-[200px] h-12 flex items-center justify-center px-4 border-l border-slate-100">
                        <select
                            value={selectedProgramId}
                            onChange={(e) => setSelectedProgramId(e.target.value)}
                            className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-600 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0 pr-6"
                        >
                            {programsList.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 pointer-events-none text-slate-400">
                            <ChevronDown size={14} strokeWidth={3} />
                        </div>
                    </div>

                    {/* Icon Decoration */}
                    <div className="hidden sm:flex flex-shrink-0 p-1 pl-4 items-center">
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            <Trophy size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 🖼️ grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32 mt-4">
                {gridData.map((item) => (
                    <ProgramCard
                        key={item.id}
                        program={item.program}
                        season={item}
                        primaryColor={branding.primaryColor || '#000'}
                        showYear={selectedProgramId !== 'All' || selectedYear !== 'All' || gridData.length > (programsList.length - 1)}
                    />
                ))}
            </div>

            {gridData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/20 flex items-center justify-center text-slate-300 mb-8">
                        <Trophy size={48} strokeWidth={1} />
                    </div>
                    <p className="text-xl font-black text-slate-400 uppercase tracking-widest">No matching records found</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedProgramId('All'); setSelectedYear('All'); }}
                        className="mt-6 text-sm font-black text-slate-900 underline underline-offset-8 uppercase tracking-widest hover:text-black"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </>
    )
}
