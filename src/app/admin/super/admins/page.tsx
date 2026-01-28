import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from 'next/link'
import { Plus, UserCheck, UserX, Mail, Building2, Send } from 'lucide-react'
import AdminActions from './AdminActions'

export default async function AdminAccountsPage() {
  const { data: admins } = await supabaseAdmin
    .from('admins')
    .select(`
      id,
      email,
      full_name,
      role,
      active,
      school_id,
      last_login,
      created_at
    `)
    .order('created_at', { ascending: false })

  // Get schools for mapping
  const { data: schools } = await supabaseAdmin
    .from('schools')
    .select('id, name, slug')

  // Prepare data for display
  const adminsWithDetails = admins?.map(admin => {
    const school = schools?.find(s => s.id === admin.school_id)

    return {
      ...admin,
      email: admin.email || 'Invite Sent',
      school_name: school?.name || 'N/A',
      school_slug: school?.slug,
    }
  }) || []

  const activeAdmins = adminsWithDetails.filter(a => a.active !== false).length
  const inactiveAdmins = adminsWithDetails.filter(a => a.active === false).length
  const superAdmins = adminsWithDetails.filter(a => a.role === 'super_admin').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Accounts</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage administrator access across all schools</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/super/admins/invite"
            className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
          >
            <Send size={18} />
            Invite Admin
          </Link>
          <Link
            href="/admin/super/admins/new"
            className="flex items-center gap-2 px-6 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            <Plus size={20} />
            Create Admin
          </Link>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={20} className="text-green-600" />
            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-3xl font-black text-green-700">{activeAdmins}</p>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <UserX size={20} className="text-red-600" />
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">Inactive</span>
          </div>
          <p className="text-3xl font-black text-red-700">{inactiveAdmins}</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={20} className="text-purple-600" />
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Super Admins</span>
          </div>
          <p className="text-3xl font-black text-purple-700">{superAdmins}</p>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[25%]">Email</th>
                <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[20%]">School</th>
                <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[12%]">Role</th>
                <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[12%]">Status</th>
                <th className="px-4 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[15%]">Last Login</th>
                <th className="px-4 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest w-[16%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminsWithDetails.map((admin, index) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <span className="font-bold text-gray-900">{admin.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-600">{admin.school_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${admin.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {admin.role === 'super_admin' ? 'Super' : 'School'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${admin.active !== false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {admin.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500 font-medium">
                      {admin.last_login
                        ? new Date(admin.last_login).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <AdminActions
                      admin={{
                        id: admin.id,
                        email: admin.email,
                        role: admin.role,
                        active: admin.active !== false,
                        school_name: admin.school_name
                      }}
                      alignTop={index >= adminsWithDetails.length - 2 && index !== 0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
