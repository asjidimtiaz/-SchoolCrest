"use client";

import { useBranding } from "@/context/BrandingContext";
import { useEffect, useState, memo } from "react";
import { supabase } from "@/lib/supabase";
import { useSchool } from "@/context/SchoolContext";
import Image from "next/image";

interface ScreensaverProps {
  onStart: () => void;
}

const Screensaver = memo(function Screensaver({ onStart }: ScreensaverProps) {
  const school = useSchool();
  const branding = useBranding();
  // Initialize with context, will be updated by client-side fetch
  const [bgConfig, setBgConfig] = useState({
    url: branding?.backgroundUrl,
    type: branding?.backgroundType
  });
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(
    branding?.backgroundType === 'image' && branding?.backgroundUrl 
      ? [branding.backgroundUrl] 
      : []
  );
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔒 Fetch latest branding data from DB to ensure Kiosk is always up to date
  useEffect(() => {
    if (!school?.id) return;

    async function loadFreshBranding() {
      const sanitize = (url?: string | null) => (url?.startsWith('blob:') ? '' : url || '');
      // Fetch fresh data from schools table
      const { data, error } = await supabase
        .from("schools")
        .select("background_url, background_type, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3")
        .eq("id", school.id)
        .single();
        
      if (!error && data) {
         const bgUrl = sanitize(data.background_url);
         setBgConfig({
            url: bgUrl,
            type: data.background_type as 'image' | 'video'
         });
         
         if (data.background_type === 'image' && bgUrl) {
             setImages([bgUrl]);
         } else {
             setImages([]);
         }

         // Process Sponsors
         const newSponsors = [data.sponsor_logo_1, data.sponsor_logo_2, data.sponsor_logo_3]
            .map(url => sanitize(url))
            .filter(Boolean) as string[];
         setSponsors(newSponsors);
      } else {
         // Fallback to initial context if fetch fails or no data
         if (branding?.backgroundType === 'image' && branding?.backgroundUrl) {
             setImages([branding.backgroundUrl]);
         }
      }
      setLoading(false);
    }

    loadFreshBranding();
  }, [school?.id, branding.backgroundUrl, branding.backgroundType]);

  // 🔁 Image rotation
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images]);

  // 🚫 Disable right click (kiosk lock)
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, []);

  // 🔒 Final guard (prevents flash / crash)
  if (!mounted || !branding) return null;

  const isVideoBackground =
    bgConfig.type === "video" && bgConfig.url;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-none"
      style={{ backgroundColor: branding.primaryColor }} // Fallback bg
      onClick={onStart}
      onTouchStart={onStart}
    >
      {/* 🎥 Background Video or 🖼️ Optimized Images */}
      {isVideoBackground ? (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={bgConfig.url || ""}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <>
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={img}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: index === i ? 1 : 0,
                  zIndex: 0,
                }}
              >
                <Image
                  src={img}
                  alt={`Background ${i + 1}`}
                  fill
                  priority={i === 0 || i === index} // Priority for initial and current image
                  className="object-cover"
                  quality={85}
                  sizes="100vw"
                />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
        </>
      )}

      {/* 🎨 Content */}
      <div className="relative z-30 flex flex-col items-center animate-fade-in text-white">
        {branding.logoUrl && (
          <div className="relative h-40 w-64 mb-4 drop-shadow-2xl">
            <Image
              src={branding.logoUrl}
              alt={branding.name}
              fill
              priority
              className="object-contain"
            />
          </div>
        )}

        <h1
          className="text-6xl font-black mb-4 text-center drop-shadow-lg tracking-tight"
          style={{ textShadow: `0 4px 12px ${branding.primaryColor}` }}
        >
          {branding.name}
        </h1>

        {branding.tagline && (
          <p className="text-2xl mb-10 text-center text-gray-200 drop-shadow-md max-w-2xl px-4">
            {branding.tagline}
          </p>
        )}

        <div className="animate-bounce-slow">
          <div
            className="px-10 py-5 rounded-full text-3xl font-black tracking-widest uppercase shadow-[0_0_50px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-transform backdrop-blur-md border-4"
            style={{
              borderColor: branding.primaryColor,
              backgroundColor: `${branding.secondaryColor}40`, // 25% opacity
              color: "#ffffff",
            }}
          >
            Touch to Start
          </div>
        </div>

        {/* 🤝 Sponsors - Below Touch to Start */}
        {sponsors.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">Powered By</p>
                <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                    {sponsors.map((logo, i) => (
                        <div key={i} className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white">
                            <Image 
                                src={logo} 
                                alt={`Sponsor ${i+1}`} 
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
});

export default Screensaver;
