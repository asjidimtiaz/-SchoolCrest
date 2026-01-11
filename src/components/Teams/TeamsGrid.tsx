'use client'

import { useState, useMemo } from 'react'
import { TeamSeasonWithTeam } from '@/lib/getTeams'
import SeasonCard from './SeasonCard'
import { useBranding } from '@/context/BrandingContext'
import { X, Trophy } from 'lucide-react'

export default function TeamsGrid({ initialData }: { initialData: TeamSeasonWithTeam[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [selectedProgram, setSelectedProgram] = useState<string>('All')
  const branding = useBranding()
  
  // Extract unique filters
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialData.map(s => s.year))).sort((a, b) => b - a)
    return ['All', ...uniqueYears.map(String)]
  }, [initialData])

  const programs = useMemo(() => {
    // Use team.name (Program Name) for filtering instead of sport_category
    const uniquePrograms = Array.from(new Set(initialData.map(s => s.team.name))).sort()
    return ['All', ...uniquePrograms]
  }, [initialData])

  const filteredData = initialData.filter(season => {
    const matchesSearch = season.team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          season.year.toString().includes(searchTerm)
    
    // Filter by Year
    const matchesYear = selectedYear === 'All' || season.year.toString() === selectedYear

    // Filter by Program
    const matchesProgram = selectedProgram === 'All' || season.team.name === selectedProgram

    return matchesSearch && matchesYear && matchesProgram;
  });

  return (
    <>
      {/* 🔍 Unified Search & Filter Toolbar */}
      <div className="my-6 flex justify-center sticky top-0 z-40">
        <div className="bg-white p-1.5 rounded-full shadow-2xl border border-gray-200/50 flex items-center max-w-4xl w-full gap-2 backdrop-blur-md bg-white/90">
            
            {/* 1. Search Section (Flexible) */}
            <div className="flex-1 flex items-center px-4 md:px-5 h-10">
                <div className="text-gray-400 mr-3">
                    <Trophy size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-base font-bold text-slate-900 placeholder:text-slate-400 h-full w-full"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-500 transition-colors"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

            {/* 2. Year Filter (Select) */}
            <div className="relative flex-shrink-0 min-w-[100px] md:min-w-[140px] h-10 flex items-center justify-center px-2">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-700 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0"
                >
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year === 'All' ? 'All Years' : year}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 pointer-events-none text-slate-400">
                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

            {/* 3. Program Filter (Select) */}
            <div className="relative flex-shrink-0 min-w-[100px] md:min-w-[160px] h-10 flex items-center justify-center px-2">
                 <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-700 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0"
                >
                    {programs.map(program => (
                        <option key={program} value={program}>
                            {program === 'All' ? 'All Programs' : program}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2 pointer-events-none text-slate-400">
                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                </div>
            </div>

            {/* Action/Submit Button - Circular Branded Anchor */}
            <div className="flex-shrink-0 p-1">
                <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: branding.primaryColor }}
                >
                    <Trophy size={18} strokeWidth={2.5} />
                </div>
            </div>

        </div>
      </div>

      {/* 🖼️ Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
        {filteredData.map((season) => (
          <SeasonCard
            key={season.id}
            season={season}
            primaryColor={branding.primaryColor || '#000'}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-6">
              <Trophy size={48} strokeWidth={1} />
            </div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No seasons found</p>
        </div>
      )}
    </>
  )
}
