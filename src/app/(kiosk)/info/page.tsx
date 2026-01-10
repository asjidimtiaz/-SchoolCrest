import { getSchool } from '@/lib/getSchool'
import { getScreensaverImages } from '@/lib/getScreensaverImages'
import BackButton from '@/components/BackButton'
import { MapPin, Phone, Mail, Share2, Info, ImageIcon, Facebook, Instagram, Globe } from 'lucide-react'

import BrandingProviderWrapper from '@/components/BrandingProviderWrapper'
import BrandingBackground from '@/components/BrandingBackground'

export default async function InfoPage() {
  const school = await getSchool()
  
  if (!school) return null

  const galleryImages = await getScreensaverImages(school.id)

  const branding = {
    name: school.name,
    logoUrl: school.logo_url,
    tagline: school.tagline,
    primaryColor: school.primary_color || '#000000',
    secondaryColor: school.secondary_color || '#ffffff',
    accentColor: school.accentColor || '#3b82f6',
    backgroundUrl: school.background_url,
    backgroundType: school.background_type as 'image' | 'video'
  }

  return (
    <BrandingProviderWrapper branding={branding}>
       <InternalInfoPage school={school} branding={branding} galleryImages={galleryImages} />
    </BrandingProviderWrapper>
  );
}

import KioskHeader from '@/components/KioskHeader'

function InternalInfoPage({ school, branding, galleryImages }: { school: any, branding: any, galleryImages: any[] }) {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col bg-gray-50/50">
        <BrandingBackground />
        <KioskHeader pageTitle="School Profile" />

        <div className="flex-1 w-full max-w-[1400px] mx-auto px-12 pt-8 pb-36 relative z-10 overflow-y-auto custom-scrollbar">
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Contact & Institutional Info (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="glass-card rounded-[2.5rem] p-8 bg-white/95 backdrop-blur-md border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                        {/* More Vibrant Branding Background for Contact */}
                        <div 
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundColor: branding.primaryColor }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-10">
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.secondaryColor} 100%)` 
                                    }}
                                >
                                    <Info size={32} strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Connect</h2>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mt-1.5" style={{ color: branding.primaryColor }}>Get in Touch</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, label: "Campus Address", value: school.address || "Address not available" },
                                    { icon: Phone, label: "Main Office", value: school.phone || "Phone not available" },
                                    { icon: Globe, label: "Official Website", value: school.website_url },
                                    { icon: Facebook, label: "Facebook", value: school.facebook_url },
                                    { icon: Instagram, label: "Instagram", value: school.instagram_url }
                                ].filter(item => item.value).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors duration-300 cursor-default group/item relative overflow-hidden">
                                        <div 
                                            className="absolute left-0 bottom-0 top-0 w-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                            style={{ backgroundColor: branding.primaryColor }}
                                        />
                                        <div 
                                            className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md transition-all group-hover/item:scale-110"
                                            style={{ backgroundColor: branding.primaryColor }}
                                        >
                                            <item.icon size={20} strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{item.label}</h3>
                                            <p className="text-slate-900 font-extrabold text-lg leading-tight truncate">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats or Institutional Tag */}
                    <div 
                        className="px-8 py-5 glass-card rounded-[2rem] shadow-2xl flex items-center justify-between group overflow-hidden relative"
                        style={{ backgroundColor: branding.primaryColor }}
                    >   
                         {/* Texture overlay */}
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-1.5 h-8 rounded-full bg-white/30" />
                            <div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Est. Tradition</p>
                                <p className="text-white font-bold text-base">{school.name}</p>
                            </div>
                        </div>
                        <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                             {branding.logoUrl && <img src={branding.logoUrl} alt="Logo" className="h-10 w-auto brightness-0 invert" />}
                        </div>
                    </div>
                </div>

                {/* Right Column: Mission & Gallery (8 cols) */}
                <div className="col-span-12 lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 flex flex-col gap-6">
                    
                    {/* Mission Statement */}
                    <div className="glass-card rounded-[2.5rem] p-10 bg-white/95 backdrop-blur-md border border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-col relative overflow-hidden group min-h-[300px]">
                         {/* Decorative Accent Ring */}
                        <div 
                            className="absolute bottom-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-[0.08] pointer-events-none"
                            style={{ backgroundColor: branding.primaryColor }}
                        />

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="mb-6 flex items-center gap-5">
                                <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Our Story</h2>
                            </div>
                            
                            <div className="prose prose-slate max-w-none relative z-10">
                                <p className="text-slate-700 font-medium text-xl lg:text-2xl leading-[1.6] italic indent-6">
                                    "{school.about_text || `Welcome to ${school.name}! We are dedicated to providing a supportive and enriching educational environment for all our students.`}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 📸 Campus Life Gallery */}
                    {galleryImages && galleryImages.length > 0 && (
                        <div className="glass-card rounded-[2.5rem] p-8 bg-white/95 backdrop-blur-md border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="p-2.5 rounded-xl text-white shadow-md relative overflow-hidden" style={{ backgroundColor: branding.primaryColor }}>
                                     <div className="absolute inset-0 bg-black/10" />
                                     <ImageIcon size={20} className="relative z-10" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Campus Life</h3>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-48 md:h-56">
                                {galleryImages.slice(0, 3).map((img, i) => (
                                    <div key={i} className="relative rounded-2xl overflow-hidden group/img h-full w-full">
                                        <img 
                                            src={img.image_url} 
                                            alt="Campus Life" 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

        {/* Centered Bottom Back Button */}
        <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto transition-all hover:scale-105 active:scale-95 duration-200">
                <BackButton label="Back to Menu" className="px-10 py-3.5 text-sm font-black shadow-[0_15px_30px_rgba(0,0,0,0.12)] bg-white text-slate-900 border border-gray-100 rounded-full" />
            </div>
        </div>
    </main>
  )
}
