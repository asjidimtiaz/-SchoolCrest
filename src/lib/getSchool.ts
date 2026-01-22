import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'
import { supabasePublic } from './supabaseServer'
import { supabaseAdmin } from './supabaseAdmin'

export const getSchool = cache(async () => {
  try {
    const headersList = await headers()

    // Resolve slug from header
    const slug = headersList.get('x-school-slug') || 'schoolcrestinteractive'

    // Verify Env Vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('CRITICAL: Supabase environment variables are missing!')
      return null
    }

    // 1. Initial Slug Resolution (Public check) - Always use public client
    const { data: schoolViaSlug, error: slugError } = await supabasePublic
      .from('schools')
      .select(`
        *,
        sponsor_logo_1,
        sponsor_logo_2, 
        sponsor_logo_3,
        facebook_url,
        instagram_url,
        nav_hall_of_fame_label,
        nav_teams_label,
        nav_calendar_label,
        nav_info_label,
        nav_hall_of_fame_tagline,
        nav_teams_tagline,
        nav_calendar_tagline,
        nav_info_tagline
      `)
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle()

    // 2. Clerk Auth-based resolution (for Admin Identity)
    let userId: string | null = null
    try {
      const authObj = await auth()
      userId = authObj.userId
    } catch (authErr) {
      console.warn('[getSchool] Clerk Auth check failed (Not Found or Config Issue):', authErr instanceof Error ? authErr.message : authErr)
    }

    if (userId) {
      try {
        // Use service role client (supabaseAdmin) to reliability get profile (Bypass RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('admins')
          .select('id, school_id, role')
          .eq('id', userId)
          .maybeSingle()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('[getSchool] Profile fetch error:', profileError.message)
        }



        if (profile?.school_id) {
          // If logged in admin HAS a school, return that school's data
          // Use supabaseAdmin to ensure we can read it regardless of public RLS
          const { data: schoolFromProfile, error: schoolFromProfileError } = await supabaseAdmin
            .from('schools')
            .select(`
              *,
              sponsor_logo_1,
              sponsor_logo_2, 
              sponsor_logo_3,
              facebook_url,
              instagram_url,
              nav_hall_of_fame_label,
              nav_teams_label,
              nav_calendar_label,
              nav_info_label,
              nav_hall_of_fame_tagline,
              nav_teams_tagline,
              nav_calendar_tagline,
              nav_info_tagline
            `)
            .eq('id', profile.school_id)
            .eq('active', true)
            .maybeSingle()

          if (schoolFromProfileError) {
            console.error('[getSchool] School fetch from profile error:', schoolFromProfileError.message)
          }

          if (schoolFromProfile) return schoolFromProfile
        }

        // Super Admin fallback to slug if no direct school_id
        if (profile?.role === 'super_admin' && schoolViaSlug) {
          return schoolViaSlug
        }
      } catch (adminErr) {
        console.warn('[getSchool] Admin resolution failed:', adminErr instanceof Error ? adminErr.message : adminErr)
      }
    }

    // Final fallback to slug-based resolution for public kiosk
    if (slugError) {
      console.error('[getSchool] Fetch failed for slug:', slugError.message)
      return null
    }

    return schoolViaSlug || null
  } catch (err) {
    console.error('FATAL in getSchool:', err instanceof Error ? err.message : 'Unknown Error')
    if (err instanceof Error) console.error('Stack:', err.stack)
    return null
  }
})
