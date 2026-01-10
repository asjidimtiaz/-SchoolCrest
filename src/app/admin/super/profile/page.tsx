import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfilePageClient from '../../profile/ProfilePageClient'

export default async function SuperAdminProfilePage() {
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
    redirect('/admin/login')
  }

  // Fetch basic profile info
  const { data: profile, error: profileError } = await supabase
    .from('admins')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'super_admin') {
    redirect('/admin')
  }

  return (
    <ProfilePageClient 
      admin={{
        email: user.email!,
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
        role: profile.role,
        school: {
          name: 'Platform Control Center',
          slug: 'system',
          active: true
        }
      }} 
      isSuperAdmin={true}
    />
  )
}
