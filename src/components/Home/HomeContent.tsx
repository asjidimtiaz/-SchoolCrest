'use client'

import { useBranding } from '@/context/BrandingContext'
import { Trophy, Users, Calendar, Info, ArrowRight, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'

export default function HomeContent() {
  const branding = useBranding()

  const navItems = [
    {
      title: branding.navHallOfFameLabel,
      description: branding.navHallOfFameTagline,
      icon: Trophy,
      href: '/hall-of-fame',
    },
    {
      title: branding.navTeamsLabel,
      description: branding.navTeamsTagline,
      icon: Users,
      href: '/teams',
    },
    {
      title: branding.navCalendarLabel,
      description: branding.navCalendarTagline,
      icon: Calendar,
      href: '/calendar',
    },
    {
      title: branding.navInfoLabel,
      description: branding.navInfoTagline,
      icon: Info,
      href: '/info',
    },
  ]

  return (
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* 🎬 Dynamic Background Media */}
      <BrandingBackground />

      {/* 🧭 Academic Header (Portal Style) */}
      <KioskHeader />
      
      {/* 📜 Navigation Cards */}
      <div className="flex-1 flex items-center justify-center px-12 py-5 z-10 overflow-hidden">
        <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
            {navItems.map((item, idx) => {
                const Icon = item.icon
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className="group relative flex items-center p-6 bg-white rounded-[2.5rem] shadow-xl active:scale-95 transition-all duration-300 overflow-hidden"
                         style={{ 
                            animationDelay: `${idx * 100}ms`,
                            borderLeft: `10px solid ${branding.accentColor}`
                        }}
                    >
                        {/* 🎨 Background Color overlay */}
                        <div 
                            className="absolute inset-0 opacity-0 transition-opacity duration-500"
                            style={{ backgroundColor: branding.primaryColor }}
                        />

                        {/* Icon Container - Colored Background */}
                        <div 
                            className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center shadow-lg mr-6 relative z-10"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            <Icon size={44} strokeWidth={2} className="text-white" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="space-y-1.5 relative z-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight transition-colors">
                            {item.title}
                            </h2>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {item.description}
                             </p>
                        </div>

                         {/* Arrow Indicator - simplified for Kiosk */}
                         <div className="ml-auto text-slate-400 group-active:text-slate-900 transition-colors relative z-10">
                            <ArrowRight size={32} />
                         </div>
                    </Link>
                )
            })}
        </div>
      </div>

      {/* 🎹 Institutional Footer with Hero Base Line */}
      <div className="relative z-10">
          <div className="w-full h-1" style={{ backgroundColor: branding.accentColor }} />
      </div>
    </main>
  )
}
