import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { getSchool } from '@/lib/getSchool'
import { SchoolProvider } from '@/context/SchoolContext'
import { BrandingProvider } from '@/context/BrandingContext'
import ReloadButton from '@/components/ReloadButton'
import SignOutButton from '@/components/SignOutButton'

import { headers } from 'next/headers'
import { Inter, Outfit } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export async function generateMetadata() {
  const school = await getSchool()
  return {
    title: school ? `${school.name} | SchoolCrest Interactive` : 'SchoolCrest Interactive',
    description: school?.tagline || 'Experience our school history and current events through our interactive kiosk.',
  }
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const school = await getSchool()
  const headersList = await headers()
  const pathname = headersList.get('x-current-path') || ''
  const isAdminPath = pathname.startsWith('/admin')

  // Only block access if no school found AND we are NOT on an admin path.
  // Admin paths handle their own "No School" errors (in AdminLayout) or allow Login.
  if (!school && !isAdminPath) {
    return (
      <ClerkProvider>
        <html lang="en" className={inter.variable}>
          <head>
            <title>School Not Found | SchoolCrest Interactive</title>
          </head>
          <body className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${inter.className}`}>
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">School Profile Not Found</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't locate a school profile for this subdomain. Please check the URL or contact your administrator.
              </p>
              <div className="space-y-4">
                <a
                  href="https://schoolcrestinteractive.com"
                  className="block w-full py-4 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  Go to Main Site
                </a>
                <ReloadButton />
                <SignOutButton />
              </div>
            </div>
            <script
              dangerouslySetInnerHTML={{
                __html: `setTimeout(() => window.location.reload(), 30000);`
              }}
            />
          </body>
        </html>
      </ClerkProvider>
    )
  }

  return (
    <ClerkProvider>
      <html suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
        <body
          suppressHydrationWarning
          className={inter.className}
          style={{
            ['--color-primary' as any]: school?.primary_color || '#000000',
            ['--color-secondary' as any]: school?.secondary_color || '#ffffff',
            ['--color-accent' as any]: school?.accent_color || '#3b82f6',
          }}
        >
          <BrandingProvider
            branding={{
              name: school?.name || 'SchoolCrest',
              logoUrl: school?.logo_url,
              tagline: school?.tagline,
              primaryColor: school?.primary_color,
              secondaryColor: school?.secondary_color,
              accentColor: school?.accent_color,
              backgroundUrl: school?.background_url,
              backgroundType: school?.background_type,
              navHallOfFameLabel: school?.nav_hall_of_fame_label,
              navTeamsLabel: school?.nav_teams_label,
              navCalendarLabel: school?.nav_calendar_label,
              navInfoLabel: school?.nav_info_label,
              navHallOfFameTagline: school?.nav_hall_of_fame_tagline,
              navTeamsTagline: school?.nav_teams_tagline,
              navCalendarTagline: school?.nav_calendar_tagline,
              navInfoTagline: school?.nav_info_tagline,
            }}
          >
            <SchoolProvider value={school}>
              <div className="mx-auto w-full max-w-[1920px] min-h-screen relative flex flex-col shadow-2xl bg-background">
                {children}
              </div>
            </SchoolProvider>
          </BrandingProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
