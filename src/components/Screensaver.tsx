"use client";

import { useBranding } from "@/context/BrandingContext";
import { useEffect, useState, memo } from "react";
import { supabase } from "@/lib/supabase";
import { useSchool } from "@/context/SchoolContext";
import Image from "next/image";
import { useKioskLock } from "@/hooks/useKioskLock";

interface ScreensaverProps {
  onStart: () => void;
}

const Screensaver = memo(function Screensaver({ onStart }: ScreensaverProps) {
  const school = useSchool();
  const branding = useBranding();
  useKioskLock();
  // Initialize with context, will be updated by client-side fetch
  const [bgConfig, setBgConfig] = useState({
    url: branding?.backgroundUrl,
    type: branding?.backgroundType
  });
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(() => {
    const url = branding?.backgroundUrl;
    if (url && (branding.backgroundType === 'image' || !branding.backgroundType)) {
        return [url];
    }
    return [];
  });
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔄 Unified Media Logic: Sync with context AND fetch from DB
  useEffect(() => {
    async function syncMedia() {
      const sanitize = (url?: string | null) => (url || '');
      
      // Start with context values as immediate fallback
      let primaryUrl = sanitize(branding?.backgroundUrl);
      let primaryType = branding?.backgroundType;
      let galleryUrls: string[] = [];
      let freshSponsors: string[] = [];

      // If we have school ID, fetch the absolute latest from DB for production accuracy
      if (school?.id) {
        const { data: schoolData, error: dbError } = await supabase
          .from("schools")
          .select("background_url, background_type, sponsor_logo_1, sponsor_logo_2, sponsor_logo_3")
          .eq("id", school.id)
          .single();

        if (!dbError && schoolData) {
          primaryUrl = sanitize(schoolData.background_url) || primaryUrl;
          primaryType = schoolData.background_type || primaryType;
          freshSponsors = [schoolData.sponsor_logo_1, schoolData.sponsor_logo_2, schoolData.sponsor_logo_3]
            .map(url => sanitize(url))
            .filter(Boolean) as string[];
        }
      }

      // Robust Media Detection: defaults to image unless file extension explicitly suggests video
      // Updated regex to handle query parameters (e.g. Supabase public URLs)
      const isUrlVideo = primaryUrl ? /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(primaryUrl) : false;
      const finalType = isUrlVideo ? 'video' : (primaryType === 'video' ? 'video' : 'image');

      setBgConfig({ url: primaryUrl, type: finalType as 'image' | 'video' });
      setSponsors(freshSponsors);

      // Construct Background: Only use primary background
      const backgroundImages: string[] = [];
      if (primaryUrl && finalType === 'image') {
        backgroundImages.push(primaryUrl);
      }

      setImages(backgroundImages);
      setLoading(false);
    }

    if (mounted) {
      syncMedia();
    }
  }, [mounted, school?.id, branding?.backgroundUrl, branding?.backgroundType]);

  // 🔁 Image rotation
  useEffect(() => {
    if (images.length <= 1) {
       setIndex(0);
       return;
    }

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

  const isVideoBackground = bgConfig.type === "video" && bgConfig.url;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-none"
      style={{ backgroundColor: branding.primaryColor }} // Fallback bg
      onClick={onStart}
      onTouchStart={onStart}
    >
      {/* 🎥 Background Video or 🖼️ Hardened Images */}
      <div className="absolute inset-0 z-0">
          {/* Branded Foundation: Uses primary color to ensure identity even if media fails */}
          <div 
            className="absolute inset-0 z-[-1]" 
            style={{ 
              background: images.length > 0 || isVideoBackground
                ? `linear-gradient(135deg, ${branding.primaryColor} 0%, #000 100%)`
                : branding.primaryColor,
              opacity: images.length > 0 || isVideoBackground ? 0.6 : 1
            }} 
          />
          <div className="absolute inset-0 bg-black z-[-2]" />

          {isVideoBackground ? (
            <div className="absolute inset-0">
              <video
                key={bgConfig.url} // Force re-render on URL change
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src={bgConfig.url || ""}
              />
            </div>
          ) : (
            <>
              {images.length > 0 && images.map((img, i) => (
                  <div
                    key={img}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{
                      opacity: index === i ? 1 : 0,
                      zIndex: 0,
                    }}
                  >
                    {/* Using standard img for background for max reliability with large local/remote assets */}
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ position: 'absolute' }}
                      loading={i === 0 ? "eager" : "lazy"}
                      onError={() => {
                        console.warn('Screensaver background failed to load:', img);
                        setImages(prev => prev.filter(item => item !== img));
                      }}
                    />
                  </div>
              ))}
            </>
          )}
          {/* Overlay Gradient for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />
      </div>

      {/* 🎨 Content Wrapper - Distributed across the page */}
      {/* 🎨 Content Wrapper - Distributed across the page */}
      <div className="relative z-30 flex-1 w-full h-full flex flex-col items-center justify-evenly py-2 px-16 animate-fade-in text-white pointer-events-none">
        


        {/* Top Section: Logo with moderate padding */}
        <div className="mt-1">
          {branding.logoUrl && (
            <div className="relative h-40 w-64 drop-shadow-2xl">
              <Image
                src={branding.logoUrl}
                alt={branding.name}
                fill
                priority
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Middle/Bottom Section: Main Text & Action with moderate padding */}
        <div className="flex flex-col items-center text-center max-w-5xl mb-2">
          <h1
            className="text-6xl font-black mb-2 drop-shadow-2xl tracking-tight leading-[1.1]"
            style={{ textShadow: `0 4px 20px ${branding.primaryColor}` }}
          >
            {branding.name}
          </h1>

          {branding.tagline && (
            <p 
              className="text-lg mb-14 opacity-70 drop-shadow-xl font-bold tracking-[0.4em] uppercase max-w-4xl px-4 text-center"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {branding.tagline}
            </p>
          )}

          <div className="animate-bounce-slow pointer-events-auto">
            <div
              className="px-14 py-6 rounded-full text-3xl font-black tracking-widest uppercase shadow-[0_0_80px_rgba(255,255,255,0.2)] transform hover:scale-105 active:scale-95 transition-all backdrop-blur-md border-[6px]"
              style={{
                borderColor: branding.primaryColor,
                backgroundColor: `${branding.secondaryColor}30`,
                color: "#ffffff",
              }}
            >
              Touch to Start
            </div>
          </div>
        </div>

        {/* 🤝 Sponsors - Relocated Below Button */}
        {sponsors.length > 0 && (
          <div className="flex flex-col items-center gap-2 pointer-events-auto z-50">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/50 drop-shadow-md">Supported By</p>
              <div className="flex items-center gap-5 bg-black/30 backdrop-blur-xl px-6 py-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  {sponsors.map((logo, i) => (
                      <div key={i} className="relative h-20 w-20 rounded-full overflow-hidden shadow-lg bg-white border-4 border-white/20">
                          <img 
                              src={logo} 
                              alt={`Sponsor ${i+1}`} 
                              className="w-full h-full object-contain p-3"
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
