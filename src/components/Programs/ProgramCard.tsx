import { Trophy, Users, Film } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { isVideoUrl } from '@/lib/mediaDetection'
import { Program, ProgramSeason } from '@/lib/getPrograms'

interface ProgramCardProps {
  program: Program
  season?: ProgramSeason
  primaryColor: string
  showYear?: boolean
}

export default function ProgramCard({ program, season, primaryColor, showYear }: ProgramCardProps) {
  // Logic: Use Season Photo if showing specific year, otherwise prefer Program Photo (Logo).
  // Fallback to Season Photo if Program Photo is missing.
  const useSeasonMedia = (showYear && season?.photo_url) || !program.photo_url;
  const photoUrl = useSeasonMedia ? season?.photo_url : program.photo_url;

  const [hasError, setHasError] = useState(false)

  return (
    <Link
      href={`/programs/${program.id}${showYear && season ? `?season=${season.year}` : ''}`}
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left w-full aspect-[3/4] border border-gray-100"
    >
      {/* Year Badge - Top Left to match Hall of Fame */}
      {showYear && (
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-1.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-white/20">
            <span className="text-sm font-black text-slate-900 tracking-tighter">
              {season?.year}
            </span>
          </div>
        </div>
      )}

      {/* Image Container - Takes available space */}
      <div className="relative flex-1 w-full bg-slate-100 overflow-hidden transition-opacity">
        {photoUrl && !hasError ? (
          <>
            {/* Blurred Background for non-aspect images */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
              style={{ backgroundImage: `url(${photoUrl})` }}
            />
            {(() => {
              // Check if the CHOSEN photo is a video.
              // If using Program Media, check program.media_type OR extension.
              // If using Season Media, check extension (season usually relies on extension).
              const isVideo = useSeasonMedia
                ? isVideoUrl(photoUrl)
                : (program.media_type === 'video' || isVideoUrl(photoUrl));

              if (isVideo) {
                return (
                  <>
                    <video
                      src={photoUrl}
                      className="w-full h-full object-cover relative z-10"
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => setHasError(true)}
                    />
                    <div className="absolute bottom-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80">
                      <Film size={12} />
                    </div>
                  </>
                );
              }

              return (
                <img
                  src={photoUrl}
                  alt={`${program.name} ${season?.year || ''}`}
                  className="w-full h-full object-contain relative z-10 transition-transform duration-700"
                  onError={() => setHasError(true)}
                />
              );
            })()}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <Users size={64} strokeWidth={1} />
          </div>
        )}

        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
      </div>

      {/* Separator Line */}
      <div className="h-1.5 w-full relative z-10" style={{ backgroundColor: primaryColor }} />

      {/* White Footer Section */}
      <div className="bg-white px-4 py-5 flex items-center justify-center relative z-10">
        <h3 className="text-xl font-black leading-none text-slate-900 text-center uppercase tracking-tight line-clamp-2">
          {program.name}
        </h3>
      </div>
    </Link>
  )
}
