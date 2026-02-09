import { syncAdminIdentity } from '@/lib/syncAdmin'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from 'next/link'
import { LayoutDashboard, Users, Settings } from 'lucide-react'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import AdminSidebarProfile from '@/components/AdminSidebarProfile'
import SuperAdminNav from '@/components/SuperAdminNav'

import AdminController from '@/components/AdminController'
import { headers } from 'next/headers'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Domain Restriction: Super Admins can ONLY access this via the main domain
  const headersList = await headers()
  const schoolSlug = headersList.get('x-school-slug')

  if (schoolSlug !== 'schoolcrestinteractive') {
    redirect('/')
  }

  let user = null
  let profile = null
  let clerkError = null

  try {
    user = await currentUser()
    if (user) {
      profile = await syncAdminIdentity()
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    clerkError = error
    console.error('[SuperAdminLayout] Clerk error:', error)
  }

  if (clerkError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
            There was a problem connecting to the authentication service. Please check your Clerk configuration.
          </p>
          <a href="/admin" className="text-blue-600 hover:underline font-medium">
            Back to Admin Login
          </a>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/')
  }

  // Double-check role directly from DB if sync returns something else (or nothing)
  // This prevents infinite redirect loops if the synced profile is stale
  if (profile?.role !== 'super_admin' && user) {
    const { data: roleData } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleData?.role === 'super_admin') {
      // Manually patch the profile object so the layout renders
      profile = { ...profile, role: 'super_admin', full_name: profile?.full_name ?? 'Super Admin' }
    }
  }

  if (profile?.role !== 'super_admin') {
    redirect('/admin')
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/super', icon: 'LayoutDashboard' },
    { label: 'Admin Accounts', href: '/admin/super/admins', icon: 'Users' },
    { label: 'Platform Settings', href: '/admin/super/settings', icon: 'Settings' },
  ]

  return (
    <AdminController>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Super Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-10">
          <div className="p-3 border-b border-gray-100/50">
            <AdminSidebarProfile
              admin={{
                name: profile?.full_name || 'Super Admin',
                email: user?.emailAddresses?.[0]?.emailAddress || '',
                avatar_url: profile?.avatar_url
              }}
              schoolName="Global Admin"
              profileLink="/admin/super/profile"
            />
          </div>

          <SuperAdminNav items={navItems} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminController>
  )
}
