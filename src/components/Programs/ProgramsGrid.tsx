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
            {/* 🏷️ Filter Controls - Ultra Compact Dual Dropdown */}
            <div className="sticky top-2 z-50 flex justify-center pt-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-2xl p-1.5 rounded-[1.75rem] border border-white/40 shadow-2xl">

                    {/* Program Dropdown */}
                    <div className="relative group min-w-[200px]">
                        <select
                            value={selectedProgramId}
                            onChange={(e) => setSelectedProgramId(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                        >
                            {programsList.map((prog) => (
                                <option key={prog.id} value={prog.id}>{prog.name}</option>
                            ))}
                        </select>
                        <div className="flex items-center justify-between px-5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:border-gray-300">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-0.5">Program</span>
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none truncate max-w-[140px]">
                                    {programsList.find(p => p.id === selectedProgramId)?.name || 'Select'}
                                </span>
                            </div>
                            <ChevronDown size={14} className="text-slate-400 ml-3 group-hover:text-slate-900 transition-colors" />
                        </div>
                    </div>

                    {/* Compact Divider */}
                    <div className="w-px h-6 bg-gray-200/50" />

                    {/* Year Dropdown */}
                    <div className="relative group min-w-[140px]">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                        >
                            {years.map((y) => (
                                <option key={y} value={y.toString()}>{y === 'All' ? 'All Seasons' : y}</option>
                            ))}
                        </select>
                        <div className="flex items-center justify-between px-5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:border-gray-300">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-0.5">Archive</span>
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                    {selectedYear === 'All' ? 'ALL YEARS' : selectedYear}
                                </span>
                            </div>
                            <ChevronDown size={14} className="text-slate-400 ml-3 group-hover:text-slate-900 transition-colors" />
                        </div>
                    </div>

                </div>
            </div>

            {/* 🖼️ grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-32">
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
