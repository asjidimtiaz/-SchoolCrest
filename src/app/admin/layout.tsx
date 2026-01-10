import { getSchool } from '@/lib/getSchool'
import Link from 'next/link'
import { LayoutDashboard, Trophy, Users, Calendar, Info, LogOut, ExternalLink, ShieldAlert, UserCircle } from 'lucide-react'
import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import AdminController from '@/components/AdminController'
import SidebarProfile from '@/components/SidebarProfile'
import AdminNav from '@/components/AdminNav'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if this is a Super Admin route or Login page or Accept Invite page
  const headersList = await headers()
  const pathname = headersList.get('x-current-path') || ''
  const isSuperAdminRoute = pathname.startsWith('/admin/super')
  const isLoginPage = pathname.startsWith('/admin/login')
  const isAcceptInvitePage = pathname.startsWith('/admin/accept-invite')

  // If it's a Super Admin route or login page, render children without sidebar
  if (isSuperAdminRoute || isLoginPage || isAcceptInvitePage) {
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
          <div className="pt-4">
             <form action="/auth/signout" method="post">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl hover:bg-red-50 border border-red-100 font-bold transition-all shadow-sm mx-auto"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
             </form>
          </div>
        </div>
      </div>
    )
  }

  const primaryColor = school.primary_color || '#000'
  
  // Fetch admin role for conditional navigation
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
  const { data: profile } = await supabase
    .from('admins')
    .select('role, full_name, avatar_url')
    .eq('id', user?.id)
    .maybeSingle()

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Hall of Fame', href: '/admin/hall-of-fame', icon: 'Trophy' },
    { label: 'Teams', href: '/admin/teams', icon: 'Users' },
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
        <aside className="w-64 glass-card fixed inset-y-3 left-3 rounded-2xl flex flex-col z-20 transition-all duration-300">
          <div className="p-3">
            <SidebarProfile 
              admin={{
                name: profile?.full_name || 'Administrator',
                email: user?.email || '',
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
        <main className="flex-1 ml-72 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </AdminController>
  )
}
