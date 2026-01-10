import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import { ArrowLeft, Mail, Building2, Send } from 'lucide-react'
import InviteAdminForm from './InviteAdminForm'

export default async function InviteAdminPage() {
  const { data: schools } = await supabaseServer
    .from('schools')
    .select('id, name, slug')
    .eq('active', true)
    .order('name')

  const { data: pendingInvites } = await supabaseServer
    .from('admin_invites')
    .select('id, email, school_id, created_at, expires_at, accepted_at, token')
    .is('accepted_at', null)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link 
          href="/admin/super/admins" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Admin Accounts
        </Link>
        <h1 className="text-4xl font-black text-gray-900">Invite Admin</h1>
        <p className="text-gray-500 mt-1 font-medium">Send a secure invite link to a new administrator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InviteAdminForm schools={schools || []} />

        {/* Pending Invites */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-6">Pending Invites</h2>
          
          {pendingInvites && pendingInvites.length > 0 ? (
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div key={invite.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{invite.email}</p>
                        <p className="text-xs text-gray-400">
                          Expires: {new Date(invite.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                      Pending
                    </span>
                  </div>
                  
                  {/* DEBUG: Display Direct Link */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Debug Link:</p>
                    <a 
                      href={`http://localhost:3000/admin/accept-invite?token=${invite.token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-black text-green-400 p-2 rounded text-xs break-all hover:underline"
                    >
                      http://localhost:3000/admin/accept-invite?token={invite.token}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No pending invites</p>
          )}
        </div>
      </div>
    </div>
  )
}
