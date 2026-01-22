import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
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

  // 2. Protect Admin Auth
  if (isAdminRoute(request)) {
    await auth.protect()
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
