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

      {/* 🔍 Detail Modal - Compact "Season Window" Style */}
      {selectedInductee && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-start justify-center p-4 animate-in fade-in duration-300">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedInductee(null)} />
          
           {/* Modal Container */}
           <div 
            className="relative w-full max-w-5xl max-h-[calc(100vh-10rem)] bg-[#FAFAFA] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 mt-24 mb-8"
            onClick={(e) => e.stopPropagation()}
           >
             
             {/* Header */}
             <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                 <div className="flex items-center gap-3">
                     <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase line-clamp-1">{selectedInductee.name}</h2>
                     <div className="hidden md:block px-3 py-1 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                        Years {selectedInductee.year}
                     </div>
                 </div>
                 <button 
                     onClick={() => setSelectedInductee(null)}
                     className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                 >
                     <X size={20} className="text-slate-900" />
                 </button>
             </div>

             {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                     
                     {/* Left: Media & Tag (7 cols) */}
                     <div className="md:col-span-12 lg:col-span-7 space-y-6">
                         {/* Photo / Video Card */}
                         <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-md border border-gray-200 relative bg-gray-900 group/media">
                             
                             {activeMedia === 'video' && selectedInductee.video_url ? (
                                <VideoPlayer 
                                  src={selectedInductee.video_url} 
                                  poster={selectedInductee.photo_url || undefined}
                                  className="w-full h-full"
                                />
                             ) : selectedInductee.photo_url ? (
                                <>
                                   {/* Blurred Background for Portrait Images */}
                                   <div 
                                       className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                                       style={{ backgroundImage: `url(${selectedInductee.photo_url})` }}
                                   />
                                   <img
                                     src={selectedInductee.photo_url}
                                     alt={selectedInductee.name}
                                     className="w-full h-full object-contain relative z-10"
                                   />
                                </>
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                    <Trophy size={120} strokeWidth={0.5} />
                                </div>
                             )}

                             {/* Media Toggle Controls */}
                             {selectedInductee.video_url && selectedInductee.photo_url && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 z-30 transition-opacity duration-300 opacity-0 group-hover/media:opacity-100">
                                  <button 
                                    onClick={() => setActiveMedia('image')}
                                    className={`p-2 rounded-lg transition-all ${activeMedia === 'image' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                  >
                                    <ImageIcon size={14} />
                                  </button>
                                  <button 
                                    onClick={() => setActiveMedia('video')}
                                    className={`p-2 rounded-lg transition-all ${activeMedia === 'video' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                  >
                                    <Video size={14} />
                                  </button>
                                </div>
                              )}
                         </div>

                         {/* Bio Section */}
                         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
                                 <Trophy size={12} /> Legacy & Bio
                             </h4>
                             <p className="text-base text-slate-800 font-medium leading-relaxed italic line-clamp-[10]">
                               "{selectedInductee.bio || 'A true legend of our school history.'}"
                             </p>
                         </div>
                     </div>

                     {/* Right: Info & Achievements (5 cols) */}
                     <div className="md:col-span-12 lg:col-span-5 space-y-6">
                        {/* Info Card */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden p-8 space-y-6">
                             <div className="space-y-2">
                                <h3 className="font-black text-slate-900 text-lg tracking-tight uppercase">Inductee Details</h3>
                                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                             </div>

                             <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Category</span>
                                    <span className="text-lg font-bold text-slate-900">{selectedInductee.category}</span>
                                </div>
                                {selectedInductee.induction_year && (
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Induction Year</span>
                                        <span className="text-lg font-bold text-slate-900">{selectedInductee.induction_year}</span>
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Achievements List */}
                        {selectedInductee.achievements && (
                          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full max-h-[400px]">
                              <div className="bg-slate-50 px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                                  <h3 className="font-black text-slate-900 text-lg tracking-tight">Achievements</h3>
                              </div>
                              
                              <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                                  <div className="space-y-2">
                                      {(() => {
                                          let list = selectedInductee.achievements;
                                          if (typeof list === 'string' && (list as string).startsWith('[')) {
                                              try { list = JSON.parse(list as string); } catch(e) {}
                                          }
                                          const items = Array.isArray(list) ? list : [list];
                                          
                                          return items.filter(Boolean).map((achievement, i) => (
                                              <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                                                      <Trophy size={14} />
                                                  </div>
                                                  <span className="font-medium text-slate-700 text-sm leading-relaxed">{achievement}</span>
                                              </div>
                                          ));
                                      })()}
                                  </div>
                              </div>
                          </div>
                        )}
                     </div>

                 </div>
             </div>

           </div>
        </div>
      )}
    </>
  )
}
