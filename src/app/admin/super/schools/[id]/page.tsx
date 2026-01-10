import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import { ArrowLeft, Shield, Globe, Power, Trash2, Calendar, Building2, ExternalLink, Mail, User, Clock, AlertTriangle } from 'lucide-react'
import { toggleSchoolStatus, deleteSchool } from '../../actions'
import PurgeSchoolButton from '../PurgeSchoolButton'

export default async function SchoolSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: school, error } = await supabaseServer
    .from('schools')
    .select('*')
    .eq('id', id)
    .single()

  const { data: admin } = await supabaseServer
    .from('admins')
    .select('id, role')
    .eq('school_id', id)
    .maybeSingle()

  if (error || !school) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 leading-tight">School Not Found</h1>
        <p className="text-gray-500 mt-2">The school record you are looking for might have been moved or deleted.</p>
        <Link href="/admin/super" className="mt-6 px-6 py-3 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-wide">
            Back to Overview
        </Link>
    </div>
  )

  return (
    <div className="space-y-8 pb-24">
      {/* 🧭 Breadcrumbs/Back */}
      <Link 
          href="/admin/super" 
          className="group inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
      >
        <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={14} />
        </div>
        Back to Platform Overview
      </Link>

      {/* 🏛️ Modern Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
                    {school.logo_url ? (
                        <img src={school.logo_url} alt={school.name} className="w-8 h-8 object-contain" />
                    ) : (
                        <Building2 size={24} className="text-gray-300" />
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{school.name}</h1>
            </div>
            <p className="text-gray-500 font-medium text-lg leading-relaxed flex items-center gap-2">
                <Globe size={18} className="text-indigo-400" />
                Administrative Control Center
            </p>
        </div>

        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-white/50 backdrop-blur-md ${
            school.active 
                ? 'bg-green-50 text-green-600 border-green-100' 
                : 'bg-red-50 text-red-600 border-red-100'
        }`}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${school.active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {school.active ? 'System Live & Public' : 'System Suspended'}
            </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* ROW 1: Access & Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* 🌐 Access Configuration */}
            <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Access Configuration</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Subdomain & Routing</p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 group-hover:text-indigo-500 transition-colors">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Public URL</p>
                                    <p className="text-lg font-black text-gray-900">{school.slug}.schoolcrestinteractive.com</p>
                                </div>
                            </div>
                            <a 
                                href={`http://${school.slug}.schoolcrestinteractive.com:3000`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white hover:bg-indigo-600 text-gray-400 hover:text-white rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 Sidebar: Platform Health */}
            <div className="lg:col-span-1 bg-black p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Shield size={100} />
                </div>
                <div className="relative z-10 space-y-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Platform Health</p>
                        <h3 className="text-4xl font-black">{school.active ? 'Optimal' : 'Offline'}</h3>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-white/50 text-[10px] font-black uppercase tracking-widest">
                            <span>Kiosk App</span>
                            <span className={school.active ? 'text-green-400' : 'text-red-400'}>{school.active ? 'Active' : 'Offline'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ROW 2: Governance & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* 🛡️ Staff Governance */}
            <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Staff Governance</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Administrative Permissions</p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">School Administrator</p>
                                    {admin ? (
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-gray-900">Assigned</span>
                                            <span className="text-sm text-gray-500 font-medium truncate max-w-[200px]">{admin.id}</span>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-black text-red-500">Unassigned</p>
                                    )}
                                </div>
                            </div>
                            <Link 
                                href={`/admin/super/admins/new?school_id=${school.id}`}
                                className="px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                            >
                                {admin ? 'Change Admin' : 'Assign Admin'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 Sidebar: History Log */}
            <div className="lg:col-span-1 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">History Log</h3>
                </div>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-1.5 h-full bg-gray-100 rounded-full" />
                        <div className="space-y-6">
                            <div className="relative pl-6">
                                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-green-500 shadow-sm" />
                                <p className="text-xs font-black text-gray-900">Account Created</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                    {new Date(school.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ROW 3: Danger & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* ⚠️ Danger Zone */}
            <div className="lg:col-span-2 bg-red-50/30 p-8 md:p-10 rounded-[2.5rem] border border-red-100/50 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-red-950 tracking-tight">Critical Actions</h2>
                            <p className="text-xs text-red-500/70 font-bold uppercase tracking-widest mt-0.5">High-Impact Operations</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <form action={async () => {
                            'use server'
                            await toggleSchoolStatus(id, !school.active)
                        }}>
                            <button 
                                type="submit"
                                className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
                                    school.active 
                                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-900/10' 
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/10'
                                }`}
                            >
                                <Power size={18} />
                                {school.active ? 'Deactivate Ecosystem' : 'Activate Ecosystem'}
                            </button>
                        </form>

                        <PurgeSchoolButton id={id} />
                    </div>
                </div>
            </div>

            {/* 📊 Sidebar: Quick Links */}
            <div className="lg:col-span-1 bg-indigo-50/50 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100/50 flex flex-col justify-center">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Quick Links</h3>
                 <div className="space-y-3">
                    <Link href={`/admin/super/admins?school_id=${school.id}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-indigo-100 text-xs font-black text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm">
                        View Admins
                        <ArrowLeft size={14} className="rotate-180" />
                    </Link>
                    <Link href="/admin/super/settings" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-indigo-100 text-xs font-black text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm">
                        Global Settings
                        <ArrowLeft size={14} className="rotate-180" />
                    </Link>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}
