'use client'

import { Program } from '@/lib/getPrograms'
import { Users, Film } from 'lucide-react'
import Link from 'next/link'
import { isVideoUrl } from '@/lib/mediaDetection'

interface SportCardProps {
  program: Program
  primaryColor: string
}

export default function SportCard({ program, primaryColor }: SportCardProps) {
  return (
    <Link
      href={`/programs/${program.id}`}
      className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60 animate-slide-up"
    >
      {/* Image Container */}
      <div className="relative flex-1 w-full bg-slate-50 overflow-hidden">
        {program.photo_url ? (
          <>
            {(() => {
              const isVideo = isVideoUrl(program.photo_url) || program.media_type === 'video';

              if (isVideo) {
                return (
                  <>
                    <video
                      src={program.photo_url}
                      className="w-full h-full object-cover transition-transform duration-700"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute bottom-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80">
                      <Film size={12} />
                    </div>
                  </>
                );
              }

              return (
                <img
                  src={program.photo_url || ''}
                  alt={program.name}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              );
            })()}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
            <Users size={64} strokeWidth={1} />
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-transparent to-transparent opacity-50 transition-opacity duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-12 text-white transform transition-transform duration-500">
        <div className="flex items-center justify-between mb-4">
          <div
            className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg bg-white/10 backdrop-blur-md border border-white/10"
            style={{ backgroundColor: primaryColor }}
          >
            {program.gender}
          </div>
          <div className="h-1 w-6 rounded-full bg-white/20" />
        </div>

        {/* Name with Background for Contrast */}
        <div className="inline-block p-2.5 -ml-2.5 rounded-xl mb-2" style={{ backgroundColor: `${primaryColor}E6` }}>
          <h3 className="text-3xl font-black leading-[1.1] text-shadow-lg text-white break-words">{program.name}</h3>
        </div>

        {/* Interactive Indicator - Cohesive Button Style */}
        <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">View History</span>
          <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transition-colors">
            <span className="text-xs font-bold leading-none">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Outer Border Glow */}
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/0 transition-colors duration-500 pointer-events-none" />
    </Link>
  )
}
