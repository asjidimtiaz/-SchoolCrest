import Link from 'next/link'
import { LayoutDashboard, Building2, Users, Settings, LogOut, ShieldAlert } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import SidebarProfile from '@/components/SidebarProfile'
import SuperAdminNav from '@/components/SuperAdminNav'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const { data: profile } = await supabase
    .from('admins')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') {
    redirect('/admin')
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/super', icon: 'LayoutDashboard' },
    { label: 'Admin Accounts', href: '/admin/super/admins', icon: 'Users' },
    { label: 'Platform Settings', href: '/admin/super/settings', icon: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-10">
        <div className="p-3 border-b border-gray-100/50">
            <SidebarProfile 
              admin={{
                name: profile?.full_name || 'Super Admin',
                email: user?.email || '',
                avatar_url: profile?.avatar_url
              }}
              schoolName="Global Admin"
              profileLink="/admin/super/profile"
            />
        </div>

        <SuperAdminNav items={navItems} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
