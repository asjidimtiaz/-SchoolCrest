import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import { Plus, Globe, Settings, EyeOff, Eye, Users, Building2, AlertCircle, ArrowUpRight, Search } from 'lucide-react'
import SchoolStatusToggle from './SchoolStatusToggle'
import DashboardBanner from './_components/DashboardBanner'
import ClientSchoolList from './ClientSchoolList'

export default async function SuperAdminDashboard() {
  const { data: schools, error } = await supabaseServer
    .from('schools')
    .select('*')
    .order('name')

  const { data: admins } = await supabaseServer
    .from('admins')
    .select('id, school_id, role, active')

  if (error) return (
    <div className="flex items-center justify-center p-20 text-red-500 font-bold bg-red-50 rounded-3xl">
        Error loading platform data. Please refresh.
    </div>
  )

  // Calculate stats
  const totalSchools = schools?.length || 0
  const activeSchools = schools?.filter(s => s.active !== false).length || 0
  const demoSchools = schools?.filter(s => s.is_demo).length || 0
  const totalAdmins = admins?.length || 0
  const activeAdmins = admins?.filter(a => a.active !== false).length || 0

  return (
    <div className="space-y-6 pb-20">
      {/* 🚀 Header Section */}
      {/* 🚀 Header Section - REPLACED BY BANNER below */}

      {/* ✨ CTA Banner */}
      <DashboardBanner />

      {/* 📊 High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Schools */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <Building2 size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Total Schools</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-gray-900">{totalSchools}</h3>
                <span className="text-xs font-bold text-gray-400">Registered</span>
            </div>
        </div>

        {/* Active Schools */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 text-green-600 transition-opacity transform group-hover:scale-110 duration-500">
                <Eye size={80} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-4">Live Deployments</p>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-gray-900">{activeSchools}</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-tight">Active</span>
                </div>
            </div>
        </div>

        {/* Demo Mode */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 text-blue-600 transition-opacity transform group-hover:scale-110 duration-500">
                <AlertCircle size={80} />
            </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">Demo Instances</p>
             <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-gray-900">{demoSchools}</h3>
                <span className="text-xs font-bold text-blue-400">Trial Mode</span>
            </div>
        </div>

        {/* Total Admins */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden xl:col-span-2">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 text-purple-600 transition-opacity transform group-hover:scale-110 duration-500">
                <Users size={120} />
            </div>
             <div className="flex justify-between items-end h-full">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Total Administrators</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-4xl font-black text-gray-900">{totalAdmins}</h3>
                        <span className="text-sm font-bold text-gray-400">Users across all schools</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1">Active Now</p>
                    <h3 className="text-4xl font-black text-purple-600">{activeAdmins}</h3>
                </div>
            </div>
        </div>
      </div>

      {/* 🏢 Schools List Section - Now Interactive */}
      <div className="-mt-4">
        <ClientSchoolList schools={schools || []} />
      </div>
    </div>
  )
}
