'use client'

import { useState, useMemo } from 'react'
import { Inductee } from '@/lib/getHallOfFame'
import { Edit, Trophy, Search, X } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import InducteePhoto from '@/components/HallOfFame/InducteePhoto'

export default function HallOfFameManager({ initialInductees }: { initialInductees: Inductee[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('All')

  // Derive unique years for the filter dropdown
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialInductees.map(i => i.year)))
    return uniqueYears.sort((a, b) => b.localeCompare(a)) // Standard string descending
  }, [initialInductees])

  const filteredInductees = initialInductees.filter(inductee => {
    const matchesSearch = inductee.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === 'All' || inductee.year.toString() === selectedYear
    return matchesSearch && matchesYear
  })

  return (
    <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-400"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            
            <div className="sm:w-48">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all cursor-pointer"
                >
                    <option value="All">All Years</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>

      <div className="glass-card rounded-2xl overflow-hidden border-none text-[13px] bg-white shadow-sm ring-1 ring-gray-950/5">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50">
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Inductee</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Year</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Category</th>
                    <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/30">
                {filteredInductees.map((inductee) => (
                    <tr key={inductee.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                <InducteePhoto 
                                    src={inductee.photo_url} 
                                    name={inductee.name} 
                                />
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">{inductee.name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">View Profile</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className="text-sm font-black text-gray-700">{inductee.year}</span>
                        </td>
                        <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-gray-100 text-[8px] font-black uppercase tracking-widest rounded-full text-gray-500 border border-gray-200">
                                {inductee.category}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                                <Link 
                                    href={`/admin/hall-of-fame/${inductee.id}`}
                                    className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 shadow-sm"
                                    title="Edit"
                                >
                                    <Edit size={14} />
                                </Link>
                                <DeleteButton id={inductee.id} />
                            </div>
                        </td>
                    </tr>
                ))}
                
                {filteredInductees.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-8 py-12 text-center">
                            <div className="flex flex-col items-center max-w-xs mx-auto">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-3 border border-gray-100">
                                    <Trophy size={24} />
                                </div>
                                <p className="text-gray-900 font-black text-base mb-1">No inductees found</p>
                                <p className="text-gray-400 text-[11px] font-medium">Try adjusting your search or filters.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}
