import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Handle Subdomain / Slug Logic
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const parts = hostname.split('.')

  let slug = 'schoolcrestinteractive' // fallback/root domain

  if (parts.length === 3 && hostname.endsWith('.schoolcrestinteractive.com')) {
    // dhthunder.schoolcrestinteractive.com
    slug = parts[0]
  } else if (hostname === 'schoolcrestinteractive.com') {
    // Root domain = demo
    slug = 'schoolcrestinteractive'
  } else if (hostname.includes('localhost')) {
    // Development fallback
    slug = 'schoolcrestinteractive'
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-school-slug', slug)
  requestHeaders.set('x-current-path', request.nextUrl.pathname)

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // 2. Handle Admin Authentication
  // Only run on /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 1. If no user and asking for /admin (but not login), redirect to login
    if (!user && !request.nextUrl.pathname.startsWith('/admin/login') && !request.nextUrl.pathname.startsWith('/admin/accept-invite')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // 2. If user exists, check role for route protection
    if (user) {
      // Fetch role from profile
      const { data: profile } = await supabase
        .from('admins')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const role = profile?.role
      const pathname = request.nextUrl.pathname
      const isSuperPath = pathname.startsWith('/admin/super')
      const isLoginPath = pathname.startsWith('/admin/login')
      const isAcceptInvitePath = pathname.startsWith('/admin/accept-invite')
      const isProfilePath = pathname === '/admin/profile'

      // A. Protect Super Admin routes (Only Super Admins allowed)
      if (isSuperPath && role !== 'super_admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }

      // B. Restrict Super Admins from regular Admin routes
      const isRegularAdminPath = pathname.startsWith('/admin') && !isSuperPath && !isLoginPath && !isAcceptInvitePath && !isProfilePath
      
      if (isRegularAdminPath && role === 'super_admin') {
         const url = request.nextUrl.clone()
         url.pathname = '/admin/super'
         return NextResponse.redirect(url)
      }

      // C. Smart Redirect from Login Page
      if (isLoginPath) {
        const url = request.nextUrl.clone()
        url.pathname = role === 'super_admin' ? '/admin/super' : '/admin'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
