'use client'

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
      title: 'Hall of Fame',
      description: 'Honoring exceptional alumni and staff',
      icon: Trophy,
      href: '/hall-of-fame',
    },
    {
      title: 'Athletic Teams',
      description: 'Explore our sports and history',
      icon: Users,
      href: '/teams',
    },
    {
      title: 'Campus Events',
      description: 'Stay updated with school activities',
      icon: Calendar,
      href: '/calendar',
    },
    {
      title: 'School Profile',
      description: 'Information about our community',
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
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            {navItems.map((item, idx) => {
                const Icon = item.icon
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className="group relative flex items-center p-5 bg-white rounded-[2rem] shadow-lg active:scale-95 transition-all duration-200 overflow-hidden"
                         style={{ 
                            animationDelay: `${idx * 100}ms`,
                            borderLeft: `8px solid ${branding.accentColor}`
                        }}
                    >
                        {/* 🎨 Hover Gradient Effect */}
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                            style={{ backgroundColor: branding.primaryColor }}
                        />

                        {/* Icon Container - Colored Background */}
                        <div 
                            className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center shadow-lg mr-5"
                            style={{ backgroundColor: branding.primaryColor }}
                        >
                            <Icon size={40} strokeWidth={2} className="text-white" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="space-y-1.5 relative z-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                            {item.title}
                            </h2>
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {item.description}
                             </p>
                        </div>

                         {/* Arrow Indicator - simplified for Kiosk */}
                         <div className="ml-auto text-slate-400 group-active:text-slate-900 transition-colors">
                            <ArrowRight size={28} />
                         </div>
                    </Link>
                )
            })}
        </div>
      </div>

      {/* 🎹 Institutional Footer */}
      <footer className="px-16 py-6 flex flex-col justify-center items-center gap-2">
          <div className="h-0.5 w-12 rounded-full" style={{ backgroundColor: branding.accentColor }} />
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Touch any card to navigate</p>
      </footer>
    </main>
  )
}
