import { headers, cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

export const getSchool = cache(async () => {
  try {
    const headersList = await headers()
    const cookieStore = await cookies()
    
    // Resolve slug from header
    const slug = headersList.get('x-school-slug') || 'schoolcrestinteractive'

    // Verify Env Vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('CRITICAL: Supabase environment variables are missing!')
      return null
    }

    // 1. Initial Slug Resolution (Public check)
    // Create a fresh client to avoid singleton state issues
    const supabasePublic = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    })

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

    // 2. Auth-based resolution (for Admin Identity)
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    if (user) {
      const { data: profile } = await supabase
        .from('admins')
        .select('school_id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.school_id) {
        // If logged in admin HAS a school, return that school's data
        const { data: schoolFromProfile } = await supabasePublic
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
        
        if (schoolFromProfile) return schoolFromProfile
      }
      
      // Super Admin fallback to slug if no direct school_id
      if (profile?.role === 'super_admin' && schoolViaSlug) {
        return schoolViaSlug
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
    return null
  }
})
