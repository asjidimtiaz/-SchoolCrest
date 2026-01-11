'use client'

import { useState } from 'react'
import { Inductee } from '@/lib/getHallOfFame'
import InducteeCard from './InducteeCard'
import { useBranding } from '@/context/BrandingContext'
import { X, Trophy, Video, Image as ImageIcon } from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import { useEffect } from 'react'

export default function HallOfFameGrid({ initialData }: { initialData: Inductee[] }) {
  const [selectedInductee, setSelectedInductee] = useState<Inductee | null>(null)
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const branding = useBranding()
  
  const categories = ['All', 'Athlete', 'Coach', 'Contributor', 'Team']

  const filteredData = initialData.filter(inductee => {
    const matchesSearch = inductee.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || inductee.category === selectedCategory
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (selectedInductee?.video_url) {
      setActiveMedia('video')
    } else {
      setActiveMedia('image')
    }
  }, [selectedInductee])

  return (
    <>
      {/* 🔍 Search and Filters */}
      <div className="my-6 flex flex-col md:flex-row gap-4 sticky top-0 z-40">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search legends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-2.5 bg-white border border-gray-200 rounded-[2rem] shadow-xl text-lg font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <div className="w-[1px] h-5 bg-slate-200" />
            <Trophy size={16} className="text-slate-400" />
          </div>
        </div>

        <div className="flex gap-1.5 p-1 bg-white border border-gray-200 rounded-[2.5rem] shadow-xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              style={selectedCategory === cat ? { backgroundColor: branding.primaryColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🖼️ Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32">
        {filteredData.map((inductee) => (
          <InducteeCard
            key={inductee.id}
            inductee={inductee}
            onSelect={setSelectedInductee}
            primaryColor={branding.primaryColor || '#000'}
          />
        ))}
      </div>

      {initialData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-6">
              <Trophy size={48} strokeWidth={1} />
            </div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-widest">No legends found</p>
        </div>
      )}

      {/* 🔎 Detail Modal */}
      {selectedInductee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Media */}
            <div 
                className="md:w-1/2 relative h-80 md:h-full group/img overflow-hidden"
                style={{ backgroundColor: branding.primaryColor || '#0f172a' }}
            >
              {activeMedia === 'video' && selectedInductee.video_url ? (
                <VideoPlayer 
                  src={selectedInductee.video_url} 
                  poster={selectedInductee.photo_url || undefined}
                  className="w-full h-full"
                />
              ) : selectedInductee.photo_url ? (
                <img
                  src={selectedInductee.photo_url}
                  alt={selectedInductee.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Trophy size={160} strokeWidth={0.5} />
                </div>
              )}

              {/* Media Toggle */}
              {selectedInductee.video_url && selectedInductee.photo_url && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/20 backdrop-blur-2xl rounded-2xl border border-white/10 z-30">
                  <button 
                    onClick={() => setActiveMedia('image')}
                    className={`p-3 rounded-xl transition-all ${activeMedia === 'image' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveMedia('video')}
                    className={`p-3 rounded-xl transition-all ${activeMedia === 'video' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                  >
                    <Video size={18} />
                  </button>
                </div>
              )}

              {/* Institutional Overlay */}
              {activeMedia === 'image' && (
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{ background: `linear-gradient(to top, ${branding.primaryColor}, transparent)` }}
                  />
              )}
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-16 flex flex-col relative overflow-y-auto bg-white custom-scrollbar">
              <button
                onClick={() => setSelectedInductee(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 active:scale-90 z-20 border border-slate-100"
                style={{ 
                    '--hover-bg': branding.primaryColor 
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = branding.primaryColor || '#0f172a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <X size={24} />
              </button>

              <div className="mb-10 relative">
                <div className="flex items-center gap-3 mb-6">
                  <span 
                      className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                      style={{ 
                          color: branding.primaryColor,
                          borderColor: `${branding.primaryColor}30`,
                          backgroundColor: `${branding.primaryColor}10`
                      }}
                  >
                      {selectedInductee.year}
                  </span>
                  {selectedInductee.induction_year && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Inducted {selectedInductee.induction_year}
                      </span>
                  )}
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                
                <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tighter mb-2">{selectedInductee.name}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                  <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">{selectedInductee.category}</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: branding.secondaryColor !== '#ffffff' ? branding.secondaryColor : branding.primaryColor }} />
                  <p className="text-xl text-slate-600 font-medium leading-relaxed italic">
                    "{selectedInductee.bio || 'LEGACY IN PROGRESS'}"
                  </p>
                </div>

                {selectedInductee.achievements && (
                  <div className="pt-8 border-t border-slate-100">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                        Achievements
                        <div className="h-px flex-1 bg-slate-50" />
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                          {(() => {
                              let list = selectedInductee.achievements;
                              // If it's a string that looks like an array, try to parse it
                              if (typeof list === 'string' && (list as string).startsWith('[')) {
                                  try { list = JSON.parse(list as string); } catch(e) {}
                              }
                              const items = Array.isArray(list) ? list : [list];
                              
                              return items.filter(Boolean).map((achievement, i) => (
                                  <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: branding.primaryColor }} />
                                      <span className="text-slate-800 font-bold text-sm tracking-tight">{achievement}</span>
                                  </div>
                              ));
                          })()}
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Close on background click */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedInductee(null)} />
        </div>
      )}
    </>
  )
}
