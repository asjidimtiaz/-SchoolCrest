import { getSchool } from '@/lib/getSchool'
import { ShieldAlert, LogOut, ExternalLink } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { syncAdminIdentity } from '@/lib/syncAdmin'
import AdminController from '@/components/AdminController'
import AdminSidebarProfile from '@/components/AdminSidebarProfile'
import AdminNav from '@/components/AdminNav'
import SignOutButton from '@/components/SignOutButton'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if this is a Super Admin route first (these handle their own auth)
  const headersList = await headers()
  const pathname = headersList.get('x-current-path') || ''
  const schoolSlug = headersList.get('x-school-slug')
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
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    clerkError = error
  }

  // Ensure we have the latest role (syncAdminIdentity might return cached/incomplete data)
  let isSuperAdmin = adminProfile?.role === 'super_admin';

  if (user && !isSuperAdmin) {
    // Double check the DB directly just in case (e.g. syncAdminIdentity failed or returned old data)
    const { data: roleData } = await supabaseAdmin
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (roleData?.role === 'super_admin') {
      isSuperAdmin = true;
    }
  }

  // STRICT DOMAIN BLOCK: If Super Admin is on a tenant domain, BLOCK THEM.
  if (isSuperAdmin && schoolSlug !== 'schoolcrestinteractive') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Wrong Portal</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You are logged in as a <strong>Super Admin</strong>, but this is a school-specific portal.
            <br /><br />
            Please use the Global Super Admin Dashboard to manage schools.
          </p>
          <div className="space-y-4">
            <a
              href="https://schoolcrestinteractive.schoolcrestinteractive.com/admin/super"
              className="block w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Super Admin Dashboard
            </a>
            <div className="flex justify-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect Super Admins to their dashboard if they hit the root /admin (on the correct domain)
  // Now using the ROBUST isSuperAdmin check
  if (isSuperAdmin && !pathname.startsWith('/admin/super')) {
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
    redirect('/sign-in')
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
          <div className="flex justify-center pt-2">
            <SignOutButton />
          </div>
        </div>
      </div>
    )
  }

  // STRICT DOMAIN BLOCK (Regular Admin):
  // If the admin's school (from profile) does not match the current domain slug, block them.
  // Exception: 'schoolcrestinteractive' (root/demo/dev) allows accessing any school dashboard (or maybe not? strictly: NO).
  // If I am Admin A, I can only access via a.schoolcrest.com?
  // User said: "only login from this domian"
  // Let's enforce: Request Slug MUST match School Slug, OR Request Slug is 'schoolcrestinteractive' (allow dev/demo fallback).
  // Actually, if I am Admin A, accessing via 'schoolcrestinteractive' (localhost) is fine.
  // But accessing via 'school-b' is NOT fine.

  // NOTE: getSchool() currently returns user's school if logged in.
  // So we just compare school.slug with schoolSlug header.
  if (schoolSlug !== 'schoolcrestinteractive' && school.slug !== schoolSlug && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-orange-100">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Wrong School Portal</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You are an admin for <strong>{school.name}</strong>, but you are trying to login from a different school's domain.
            <br /><br />
            Please use your school's official portal.
          </p>
          <div className="space-y-4">
            <a
              href={`https://${school.slug}.schoolcrestinteractive.com/admin`}
              className="block w-full py-3 px-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Go to {school.name} Portal
            </a>
            <div className="flex justify-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    )
  }


  const primaryColor = school.primary_color || '#000'

  // No need to re-fetch profile, we have it from syncAdminIdentity
  const profile = adminProfile;


  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutGrid' },
    { label: 'Hall of Fame', href: '/admin/hall-of-fame', icon: 'Trophy' },
    { label: 'Programs', href: '/admin/programs', icon: 'Shapes' },
    { label: 'Events', href: '/admin/calendar', icon: 'Calendar' },
    { label: 'Calendar', href: '/admin/school-calendar', icon: 'Calendar' },
    { label: 'Branding', href: '/admin/branding', icon: 'Palette' },
    { label: 'School Info', href: '/admin/info', icon: 'Info' },
    { label: 'My Profile', href: '/admin/profile', icon: 'UserCircle' },
  ]

  const kioskUrl = school.slug === 'schoolcrestinteractive'
    ? '/'
    : `https://${school.slug}.schoolcrestinteractive.com`

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
              isSuperAdmin={isSuperAdmin}
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
