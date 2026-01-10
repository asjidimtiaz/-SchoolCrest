"use client";

import { useBranding } from "@/context/BrandingContext";
import { useEffect, useState, memo } from "react";
import { supabase } from "@/lib/supabase";
import { useSchool } from "@/context/SchoolContext";

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

  // 🔒 Fetch latest branding data from DB to ensure Kiosk is always up to date
  useEffect(() => {
    if (!school?.id) return;

    async function loadFreshBranding() {
      // Fetch fresh data from schools table
      const { data, error } = await supabase
        .from("schools")
        .select("background_url, background_type, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3")
        .eq("id", school.id)
        .single();
        
      if (!error && data) {
         setBgConfig({
            url: data.background_url,
            type: data.background_type as 'image' | 'video'
         });
         
         if (data.background_type === 'image' && data.background_url) {
             setImages([data.background_url]);
         } else {
             setImages([]);
         }

         // Process Sponsors
         const newSponsors = [data.sponsor_logo_1, data.sponsor_logo_2, data.sponsor_logo_3].filter(Boolean) as string[];
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
  }, [school?.id, branding]);

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
  if (!branding) return null;

  const isVideoBackground =
    bgConfig.type === "video" && bgConfig.url;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-none"
      style={{ backgroundColor: branding.primaryColor }} // Fallback bg
      onClick={onStart}
      onTouchStart={onStart}
    >
      {/* 🎥 Background Video */}
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
          {/* Overlay to ensure text readability over video */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <>
          {/* 🖼️ Background Images with Cross-fade */}
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={img}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${img})`,
                  opacity: index === i ? 1 : 0,
                  zIndex: 0,
                }}
              />
            ))
          ) : (
            // Fallback if no images and no video
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          )}
          {/* 🌑 Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
        </>
      )}

      {/* 🎨 Content */}
      <div className="relative z-30 flex flex-col items-center animate-fade-in text-white">
        {branding.logoUrl && (
          <img
            src={branding.logoUrl}
            alt={branding.name}
            className="h-40 w-40 object-cover rounded-full mb-8 drop-shadow-2xl bg-white/10 backdrop-blur-sm p-2"
          />
        )}

        <h1
          className="text-6xl font-black mb-4 text-center drop-shadow-lg tracking-tight"
          style={{ textShadow: `0 4px 12px ${branding.primaryColor}` }}
        >
          {branding.name}
        </h1>

        {branding.tagline && (
          <p className="text-2xl mb-16 text-center text-gray-200 drop-shadow-md max-w-2xl px-4">
            {branding.tagline}
          </p>
        )}

        <div className="animate-bounce-slow">
          <div
            className="px-12 py-6 rounded-full text-3xl font-black tracking-widest uppercase shadow-[0_0_50px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-transform backdrop-blur-md border-4"
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
            <div className="mt-5 flex flex-col items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">Powered By</p>
                <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                    {sponsors.map((logo, i) => (
                        <img 
                            key={i} 
                            src={logo} 
                            alt={`Sponsor ${i+1}`} 
                            className="h-10 w-10 rounded-full object-cover bg-white shadow-lg border-2 border-white/20"
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
});

export default Screensaver;
