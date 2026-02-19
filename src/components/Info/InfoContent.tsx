'use client'

import { MapPin, Phone, Mail, Share2, Info, ImageIcon, Facebook, Instagram, Globe, Quote } from 'lucide-react'
import { useBranding } from '@/context/BrandingContext'
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'
import BackButton from '@/components/BackButton'

interface InfoContentProps {
    school: any
    galleryImages: any[]
}

export default function InfoContent({ school, galleryImages }: InfoContentProps) {
    const branding = useBranding()

    return (
        <main className="min-h-screen relative flex flex-col bg-gray-50/50">
            <BrandingBackground />
            <KioskHeader pageTitle={branding.navInfoLabel} />

            <div className="flex-1 w-full max-w-[1400px] mx-auto px-12 pt-8 pb-36 relative z-10">
                {/* Top Featured Area: The Quote (Hero Style) */}
                {school.about_quote && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-8 duration-1000">
                        <div className="relative group/quote">
                            {/* Premium Mission Well - Now More Compact Hero */}
                            <div
                                className="relative p-6 lg:p-8 rounded-[2.5rem] overflow-hidden border border-white/40 shadow-[0_30px_60px_rgba(0,0,0,0.08)] bg-white/90 backdrop-blur-xl"
                            >
                                {/* Branded vertical accent bar */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-2.5 lg:w-3"
                                    style={{ backgroundColor: branding.primaryColor }}
                                />

                                {/* Subtlest background tint */}
                                <div
                                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundColor: branding.primaryColor }}
                                />

                                <div className="relative z-10 pl-4 lg:pl-10 flex items-center gap-6 lg:gap-10">
                                    {/* Opening Quote Mark - Compact but elegant */}
                                    <div
                                        className="opacity-20 shrink-0 hidden sm:block"
                                        style={{ color: branding.primaryColor }}
                                    >
                                        <Quote size={40} strokeWidth={2.5} fill="currentColor" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-slate-900 font-black text-xl lg:text-2xl leading-relaxed tracking-tight italic mb-3">
                                            {school.about_quote_show_marks ? `"${school.about_quote}"` : school.about_quote}
                                        </p>

                                        {school.about_quote_author && (
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="h-px w-10 opacity-30"
                                                    style={{ backgroundColor: branding.primaryColor }}
                                                />
                                                <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                                                    {school.about_quote_author}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-8 items-start">

                    {/* Left Column: Contact & Institutional Info (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
                        {/* ... (Connect Card Content remains same) ... */}
                        <div className="glass-card rounded-[2.5rem] p-8 bg-white/95 backdrop-blur-md border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                            {/* More Vibrant Branding Background for Contact */}
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundColor: branding.primaryColor }}
                            />

                            <div className="relative z-10">
                                <div className="flex items-center gap-5 mb-10">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
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
                                        <div key={idx} className="flex items-center gap-5 p-3.5 rounded-2xl relative overflow-hidden cursor-default">
                                            <div
                                                className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md"
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

                    </div>

                    {/* Right Column: Mission & Gallery (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 flex flex-col gap-6">

                        {/* Mission Statement */}
                        <div className="glass-card rounded-[2.5rem] p-10 bg-white/95 backdrop-blur-md border border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-col relative overflow-hidden group">
                            {/* Decorative Accent Ring */}
                            <div
                                className="absolute bottom-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-[0.08] pointer-events-none"
                                style={{ backgroundColor: branding.primaryColor }}
                            />

                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="mb-8 flex items-center gap-5">
                                    <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Our Story</h2>
                                </div>

                                <div className="space-y-12 relative z-10">
                                    {school.about_text && (
                                        <div className={`relative ${school.about_text_show_marks ? 'pl-8' : ''}`}>
                                            {school.about_text_show_marks && (
                                                <div
                                                    className="absolute left-0 top-0 text-3xl opacity-20"
                                                    style={{ color: branding.primaryColor }}
                                                >
                                                    <Quote size={24} strokeWidth={3} fill="currentColor" />
                                                </div>
                                            )}
                                            <p className="text-slate-600 font-medium text-xl leading-relaxed tracking-tight">
                                                {school.about_text}
                                            </p>
                                        </div>
                                    )}

                                    {!school.about_text && !school.about_quote && (
                                        <p className="text-slate-600 font-bold text-xl leading-relaxed">
                                            Welcome to {school.name}! We are dedicated to providing a supportive and enriching educational environment for all our students.
                                        </p>
                                    )}
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
                                        <div key={i} className="relative rounded-2xl overflow-hidden h-full w-full bg-slate-50">
                                            {/* Blurred Background for non-aspect images */}
                                            <div
                                                className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
                                                style={{ backgroundImage: `url(${img.image_url})` }}
                                            />
                                            <img
                                                src={img.image_url}
                                                alt="Campus Life"
                                                className="w-full h-full object-contain relative z-10"
                                            />
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
                <div className="pointer-events-auto active:scale-95 duration-200">
                    <BackButton label="Back to Menu" className="px-10 py-3.5 text-sm font-black shadow-[0_15px_30px_rgba(0,0,0,0.12)] bg-white text-slate-900 border border-gray-100 rounded-full" />
                </div>
            </div>
        </main>
    )
}
