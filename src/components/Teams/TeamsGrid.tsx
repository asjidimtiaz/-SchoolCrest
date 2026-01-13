'use client'

import { useState, useMemo } from 'react'
import { Team } from '@/lib/getTeams'
import TeamCard from './TeamCard'
import { useBranding } from '@/context/BrandingContext'
import { X, Trophy, Search } from 'lucide-react'

export default function TeamsGrid({ initialData, teamYears }: { initialData: Team[], teamYears: { team_id: string; year: number }[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const branding = useBranding()
  
  // Extract unique filters (Sport Category)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(initialData.map(t => t.sport_category))).filter(Boolean).sort()
    return ['All', ...uniqueCategories]
  }, [initialData])

  // Extract unique years
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(teamYears.map(ty => ty.year))).sort((a, b) => b - a)
    return ['All', ...uniqueYears]
  }, [teamYears])

  const filteredData = initialData.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by Category
    const matchesCategory = selectedCategory === 'All' || team.sport_category === selectedCategory

    // Filter by Year
    // If 'All' is selected, show all teams.
    // If a specific year is selected, check if this team has a season in that year.
    const matchesYear = selectedYear === 'All' || teamYears.some(ty => ty.team_id === team.id && ty.year.toString() === selectedYear)

    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <>
      {/* 🔍 Unified Search & Filter Toolbar */}
      <div className="my-6 flex justify-center sticky top-0 z-40">
        <div className="bg-white p-1.5 rounded-full shadow-2xl border border-gray-200/50 flex items-center max-w-4xl w-full gap-0 backdrop-blur-md bg-white/90">
            
            {/* 1. Search Section (Flexible) */}
            <div className="flex-1 flex items-center px-4 md:px-5 h-10">
                <div className="text-gray-400 mr-3">
                    <Search size={18} />
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

            {/* 2. Year Filter (Select) */}
            <div className="relative flex-shrink-0 min-w-[100px] md:min-w-[140px] h-10 flex items-center justify-center px-2 border-l border-gray-100">
                 <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-700 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0"
                >
                    {years.map(y => (
                        <option key={y} value={y}>
                            {y === 'All' ? 'ALL YEARS' : y}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2 pointer-events-none text-slate-400">
                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                </div>
            </div>

            {/* 3. Category Filter (Select) */}
            <div className="relative flex-shrink-0 min-w-[100px] md:min-w-[160px] h-10 flex items-center justify-center px-2 border-l border-gray-100">
                 <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-slate-700 cursor-pointer w-full text-center hover:text-slate-900 transition-colors focus:ring-0"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat === 'All' ? 'ALL PROGRAMS' : cat}
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
            <div className="flex-shrink-0 p-1 pl-3">
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
        {filteredData.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            primaryColor={branding.primaryColor || '#000'}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-6">
              <Trophy size={48} strokeWidth={1} />
            </div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No teams found</p>
        </div>
      )}
    </>
  )
}
