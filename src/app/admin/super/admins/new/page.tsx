import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CreateAdminForm from './CreateAdminForm'

export default async function NewAdminPage() {
  const { data: schools } = await supabaseServer
    .from('schools')
    .select('id, name, slug')
    .eq('active', true)
    .order('name')

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link 
          href="/admin/super/admins" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Admin Accounts
        </Link>
        <h1 className="text-4xl font-black text-gray-900">Create Admin Account</h1>
        <p className="text-gray-500 mt-1 font-medium">Add a new administrator to manage a school</p>
      </div>

      <CreateAdminForm schools={schools || []} />
    </div>
  )
}
