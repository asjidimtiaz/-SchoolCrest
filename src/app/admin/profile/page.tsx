import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import ProfilePageClient from './ProfilePageClient'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/admin')
  }

  // 1. Fetch profile info using Service Role to bypass potential RLS issues
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('admins')
    .select(`
      id,
      role,
      full_name,
      avatar_url,
      email,
      school:schools (
        name,
        slug,
        active
      )
    `)
    .eq('id', user.id)
    .maybeSingle()

  if (profileError && profileError.message.includes('full_name')) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-500">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900">Finalizing Setup</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Almost there! Please ensure the profile columns are added to your database.
          </p>
        </div>

        <div className="bg-gray-100 text-left p-6 rounded-2xl overflow-x-auto">
          <code className="text-gray-600 text-xs font-mono">
            {`ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;`}
          </code>
        </div>

        <a
          href="/admin/profile"
          className="inline-block px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          Done, Refresh
        </a>
      </div>
    )
  }

  if (profileError || !profile) {
    // If sync failed or something went wrong, redirect to dashboard which will re-trigger sync
    redirect('/admin')
  }

  return (
    <ProfilePageClient
      admin={{
        email: profile.email || user.emailAddresses[0].emailAddress,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        school: profile.school as any
      }}
    />
  )
}
