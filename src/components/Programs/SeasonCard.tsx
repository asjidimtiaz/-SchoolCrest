'use client'

import { ProgramSeasonWithProgram } from '@/lib/getPrograms'
import { Users, Film } from 'lucide-react'
import Link from 'next/link'
import { isVideoUrl } from '@/lib/mediaDetection'

interface SeasonCardProps {
  season: ProgramSeasonWithProgram
  primaryColor: string
}

export default function SeasonCard({ season, primaryColor }: SeasonCardProps) {
  // Prioritize season photo, fallback to program photo
  const photoUrl = season.photo_url || season.program.photo_url

  return (
    <Link
      href={`/programs/${season.program.id}?season=${season.year}`}
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-md transition-all duration-500 text-left w-full aspect-[3/4] border border-slate-200/60 animate-slide-up"
    >
      {/* Image Container - Full Card */}
      <div className="absolute inset-0 w-full h-full bg-slate-50 overflow-hidden">
        {photoUrl ? (
          <>
            {(() => {
              const photoUrl = season.photo_url || season.program.photo_url;
              const isVideo = (season.media_type === 'video') || isVideoUrl(season.photo_url) || (!season.photo_url && (isVideoUrl(season.program.photo_url) || season.program.media_type === 'video'));

              if (isVideo && photoUrl) {
                return (
                  <>
                    <video
                      src={photoUrl}
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
                  src={photoUrl || ''}
                  alt={season.program.name}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              );
            })()}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-200">
            <Users size={80} strokeWidth={1} />
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-70 transition-opacity duration-500" />
      </div>

      {/* Top Badge: Year */}
      <div className="absolute top-5 left-5 z-10">
        <div className="px-4 py-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
          <span className="text-xl font-black text-slate-900 tracking-tighter">{season.year}</span>
        </div>
      </div>

      {/* Content Overlay - Simplified to just Name */}
      <div className="absolute inset-x-0 bottom-0 p-8 pt-12 text-white text-center">
        {/* Program Name with Background for Contrast */}
        <div
          className="inline-block px-6 py-3 rounded-2xl shadow-2xl border border-white/10"
          style={{ backgroundColor: `${primaryColor}CC`, backdropFilter: 'blur(8px)' }}
        >
          <h3 className="text-2xl font-black leading-tight text-white break-words tracking-tight uppercase">
            {season.program.name}
          </h3>
        </div>
      </div>

      {/* Outer Border Glow - Constant */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-white/10 pointer-events-none" />
    </Link>
  )
}
