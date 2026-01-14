import { getSchool } from '@/lib/getSchool'
import { supabaseServer } from '@/lib/supabaseServer'
import { Trophy, Users, Calendar, ArrowRight, PlusCircle, Settings, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const school = await getSchool()
  const primaryColor = school?.primary_color || '#3b82f6'

  if (!school) return null

  // Fetch real-time counts
  const [hofRes, teamsRes, eventsRes] = await Promise.all([
    supabaseServer.from('hall_of_fame').select('*', { count: 'exact', head: true }).eq('school_id', school.id),
    supabaseServer.from('teams').select('*', { count: 'exact', head: true }).eq('school_id', school.id),
    supabaseServer.from('events').select('*', { count: 'exact', head: true }).eq('school_id', school.id).gte('start_time', new Date().toISOString())
  ])

  const stats = [
    { label: 'Hall of Fame', value: String(hofRes.count || 0), icon: Trophy, href: '/admin/hall-of-fame', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Programs', value: String(teamsRes.count || 0), icon: Users, href: '/admin/teams', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upcoming Events', value: String(eventsRes.count || 0), icon: Calendar, href: '/admin/calendar', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Header with Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
             <span className="px-2 py-0.5 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.1em]">Console</span>
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Node Status: <span className="text-slate-500">{school?.name || 'Authorized'}</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Administrative Control Overview</p>
        </div>
        
        <Link 
          href="/admin/info"
          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-soft hover:shadow-premium transition-all font-bold text-gray-700 text-xs whitespace-nowrap"
        >
          <Settings size={14} />
          School Settings
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((item) => (
          <Link key={item.label} href={item.href} className="group">
            <div className="glass-card p-4 rounded-xl space-y-2 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md border border-white/50">
              <div className="flex items-center justify-between">
                <div className={`p-1.5 ${item.bg} ${item.color} rounded-lg transition-transform duration-500 group-hover:scale-105`}>
                  <item.icon size={16} />
                </div>
                <ArrowRight size={14} className="text-gray-300 transform -rotate-45 group-hover:rotate-0 group-hover:text-gray-900 transition-all" />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 mb-0 leading-none">{item.value}</p>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none mt-2">{item.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Quick Actions */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Quick Actions</h2>
            <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center text-gray-400">
               <PlusCircle size={14} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Link href="/admin/hall-of-fame/new" className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-soft transition-all text-left space-y-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-amber-600 shadow-sm border border-gray-50 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Trophy size={14} />
              </div>
              <p className="font-bold text-gray-900 text-xs leading-tight">Add Inductee</p>
            </Link>
            <Link href="/admin/teams/new" className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-soft transition-all text-left space-y-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={14} />
              </div>
              <p className="font-bold text-gray-900 text-xs leading-tight">Add New Program</p>
            </Link>
            <Link href="/admin/calendar/new" className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-soft transition-all text-left space-y-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm border border-gray-50 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Calendar size={14} />
              </div>
              <p className="font-bold text-gray-900 text-xs leading-tight">New Event</p>
            </Link>
          </div>
        </div>

        {/* Live Preview / Kiosk Status */}
        <div className="glass-dark p-5 rounded-2xl text-white space-y-3 overflow-hidden relative border-none">
          <div className="relative z-10 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="px-1.5 py-0.5 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white/50 border border-white/5">Status</div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                Live
              </div>
            </div>
            
            <h2 className="text-xl font-black leading-tight tracking-tight">Kiosk active at {school?.name}.</h2>
            
            <a 
              href="/" 
              target="_blank"
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-white text-black rounded-lg font-black text-xs hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              <ExternalLink size={14} />
              Open Live View
            </a>
          </div>



          
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -ml-10 -mb-10" />
        </div>
      </div>
    </div>
  )
}
