import { Plus, Sparkles, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] shadow-xl shadow-indigo-200/50 group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-10 -translate-y-6">
        <Sparkles size={110} className="text-white" />
      </div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-12 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl -mt-8 pointer-events-none" />
      
      {/* Star/Sparkle Accents */}
      <div className="absolute top-8 right-1/3 text-indigo-200/40 animate-pulse">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
      </div>
      <div className="absolute bottom-10 left-10 text-violet-200/30 animate-pulse delay-700">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" /></svg>
      </div>

      <div className="relative z-10 px-8 py-10 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest">
            <Building2 size={12} />
            <span>Super Admin</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
            Platform Command
          </h2>
          
          <p className="text-indigo-100 font-medium text-base leading-relaxed">
            Real-time overview of the SchoolCrest ecosystem.
          </p>
        </div>

        <Link 
          href="/admin/super/schools/new" 
          className="group/btn flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-600 font-black rounded-full hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center group-hover/btn:rotate-90 transition-transform">
             <Plus size={16} className="text-indigo-600" />
          </div>
          <span className="uppercase tracking-wide text-xs">Register New School</span>
        </Link>
      </div>
    </div>
  )
}
