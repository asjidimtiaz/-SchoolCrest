import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import ProfilePageClient from './ProfilePageClient'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log('[ProfilePage] No user found, redirecting to login')
    redirect('/admin/login')
  }

  // 1. Fetch basic profile info
  const { data: profile, error: profileError } = await supabase
    .from('admins')
    .select(`
      role,
      school:schools (
        name,
        slug,
        active
      )
    `)
    .eq('id', user.id)
    .maybeSingle()

  // 2. Fetch full_name separately (to handle missing column gracefully)
  const { data: nameData, error: nameError } = await supabase
    .from('admins')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  if (nameError && nameError.message.includes('full_name')) {
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
    redirect('/admin')
  }

  return (
    <ProfilePageClient 
      admin={{
        email: user.email!,
        full_name: nameData?.full_name || null,
        avatar_url: nameData?.avatar_url || null,
        role: profile.role,
        school: profile.school as any
      }} 
    />
  )
}
