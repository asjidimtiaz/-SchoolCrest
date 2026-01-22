import { getSchool } from '@/lib/getSchool'
import { ShieldAlert, LogOut, ExternalLink } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { syncAdminIdentity } from '@/lib/syncAdmin'
import AdminController from '@/components/AdminController'
import AdminSidebarProfile from '@/components/AdminSidebarProfile'
import AdminNav from '@/components/AdminNav'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if this is a Super Admin route first (these handle their own auth)
  const headersList = await headers()
  const pathname = headersList.get('x-current-path') || ''
  const isSuperAdminRoute = pathname.startsWith('/admin/super')

  if (isSuperAdminRoute) {
    return <>{children}</>
  }

  // Try to get current user - if this fails, Clerk is not configured properly
  let user = null
  let adminProfile = null
  let clerkError = null

  try {
    user = await currentUser()
    if (user) {
      adminProfile = await syncAdminIdentity()
    }
  } catch (error) {
    clerkError = error
    console.error('[AdminLayout] Clerk error:', error)
  }

  // Redirect Super Admins to their dashboard if they hit the root /admin
  if (adminProfile?.role === 'super_admin' && !pathname.startsWith('/admin/super')) {
    redirect('/admin/super')
  }

  // If Clerk is erroring, show setup instructions
  if (clerkError) {
    return (
      <html>
        <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Clerk Configuration Error</h1>
            <p className="text-gray-700 mb-4">
              Clerk is not configured properly. Please complete the Clerk-Supabase integration:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
              <li>Go to Clerk Dashboard → Integrations</li>
              <li>Find "Supabase" and click Configure</li>
              <li>Add your Supabase Project URL and JWT Secret</li>
              <li>Go to Supabase Dashboard → Authentication → Providers</li>
              <li>Add Clerk as a provider with your JWKS URL</li>
            </ol>
            <a
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Go to Home
            </a>
          </div>
        </body>
      </html>
    )
  }

  // If no user, they need to sign in (Clerk will redirect)
  if (!user) {
    return <AdminController>{children}</AdminController>
  }

  const school = await getSchool()

  // Strict Isolation: If no school is found for a logged-in admin, block access.
  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">No School Assigned</h1>
          <p className="text-gray-500">
            Your admin account is not linked to any active school. Please contact support or your super admin.
          </p>
        </div>
      </div>
    )
  }

  const primaryColor = school.primary_color || '#000'

  // Fetch admin role for conditional navigation
  const supabase = await getSupabaseServer()
  const { data: profile } = await supabase
    .from('admins')
    .select('role, full_name, avatar_url')
    .eq('id', user?.id)
    .maybeSingle()

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutGrid' },
    { label: 'Hall of Fame', href: '/admin/hall-of-fame', icon: 'Trophy' },
    { label: 'Programs', href: '/admin/teams', icon: 'Shapes' },
    { label: 'Events', href: '/admin/calendar', icon: 'Calendar' },
    { label: 'Calendar', href: '/admin/school-calendar', icon: 'Calendar' },
    { label: 'School Info', href: '/admin/info', icon: 'Info' },
    { label: 'My Profile', href: '/admin/profile', icon: 'UserCircle' },
  ]

  const kioskUrl = school.slug === 'schoolcrestinteractive'
    ? '/'
    : `http://${school.slug}.schoolcrestinteractive.com:3000` // Adjust for production later

  return (
    <AdminController>
      <div className="min-h-screen bg-gray-50/50 flex">
        {/* Sidebar */}
        <aside className="w-64 glass-card sticky top-3 h-[calc(100vh-24px)] rounded-2xl flex flex-col z-20 transition-all duration-300 ml-3">
          <div className="p-3">
            <AdminSidebarProfile
              admin={{
                name: profile?.full_name || 'Administrator',
                email: user?.emailAddresses?.[0]?.emailAddress || '',
                avatar_url: profile?.avatar_url
              }}
              schoolName={school.name}
              primaryColor={primaryColor}
            />
          </div>

          <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
            <div className="px-3 mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Application</span>
            </div>
            <AdminNav items={navItems} primaryColor={primaryColor} />

            <div className="pt-4 mt-4 border-t border-gray-100/50 px-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block mb-2">Platform</span>
              <a
                href={kioskUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 text-blue-600 rounded-xl hover:bg-white hover:shadow-soft transition-all font-bold group border border-transparent hover:border-blue-50 text-sm"
              >
                <div className="p-1.5 bg-blue-100 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ExternalLink size={10} />
                </div>
                <span className="tracking-tight">Kiosk Live</span>
              </a>
            </div>
          </nav>

          {/* Redundant Sign Out removed (now in SidebarProfile) */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </AdminController>
  )
}
