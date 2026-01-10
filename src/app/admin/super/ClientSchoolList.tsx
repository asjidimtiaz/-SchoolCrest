'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Globe, Settings, ArrowUpRight, Search } from 'lucide-react'
import SchoolStatusToggle from './SchoolStatusToggle'

interface School {
  id: string
  name: string
  slug: string
  logo_url: string | null
  active: boolean | null
  is_demo: boolean
}

export default function ClientSchoolList({ schools }: { schools: School[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSchools = schools.filter(school => {
    const query = searchQuery.toLowerCase()
    return (
      school.name.toLowerCase().includes(query) ||
      school.slug.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              School Directory
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">{schools.length}</span>
           </h2>
           
           <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all w-64">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text"
                placeholder="SEARCH SCHOOLS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-wide text-gray-700 placeholder-gray-400 w-full"
              />
           </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <div 
              key={school.id} 
              className="group bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
            >
               {/* Logo & Status */}
               <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        {school.logo_url ? (
                            <img src={school.logo_url} alt={school.name} className="w-12 h-12 object-contain" />
                        ) : (
                            <Globe size={32} className="text-gray-300" />
                        )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-full border-2 border-white ${school.active !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
               </div>
               
               {/* Details */}
               <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                        <h2 className="text-xl font-black text-gray-900 truncate">{school.name}</h2>
                        {school.is_demo && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-md">Demo</span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 font-mono bg-gray-50 inline-block px-2 py-1 rounded-md">
                        {school.slug}.schoolcrestinteractive.com
                    </p>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-0 border-gray-50 pt-4 md:pt-0">
                  <a 
                     href={`http://${school.slug}.schoolcrestinteractive.com:3000`} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="px-5 py-3 text-xs font-black uppercase tracking-wide text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                  >
                     Visit Kiosk
                     <ArrowUpRight size={14} />
                  </a>
                  
                  <Link 
                     href={`/admin/super/schools/${school.id}`}
                     className="px-5 py-3 text-xs font-black uppercase tracking-wide text-white bg-black hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
                  >
                     <Settings size={14} />
                     Manage
                  </Link>
                  
                  <div className="w-px h-8 bg-gray-100 mx-2 hidden md:block"></div>
                  
                  <SchoolStatusToggle schoolId={school.id} currentStatus={school.active !== false} />
               </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
             <p className="font-bold">No schools found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
