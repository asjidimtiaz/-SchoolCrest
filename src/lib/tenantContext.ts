import { headers } from 'next/headers'
import { supabasePublic } from '@/lib/supabaseServer'

export interface TenantContext {
  school: {
    id: string
    name: string
    slug: string
    primary_color: string
    secondary_color: string
    accent_color: string
    logo_url: string | null
    tagline: string | null
    active: boolean
  } | null
  isValid: boolean
  error?: string
}

/**
 * Get the current tenant (school) context from the request
 * This is the core of multi-tenancy - every request knows which school it belongs to
 */
export async function getTenantContext(): Promise<TenantContext> {
  try {
    const headersList = await headers()
    const slug = headersList.get('x-school-slug') || 'schoolcrestinteractive'

    const { data: school, error } = await supabasePublic
      .from('schools')
      .select('id, name, slug, primary_color, secondary_color, accent_color, logo_url, tagline, active')
      .eq('slug', slug)
      .single()

    if (error || !school) {
      return {
        school: null,
        isValid: false,
        error: 'School not found'
      }
    }

    if (!school.active) {
      return {
        school: null,
        isValid: false,
        error: 'School is inactive'
      }
    }

    return {
      school,
      isValid: true
    }
  } catch (err) {
    console.error('Error getting tenant context:', err)
    return {
      school: null,
      isValid: false,
      error: 'Failed to resolve tenant'
    }
  }
}

/**
 * Get school ID from slug - useful for database operations
 */
export async function getSchoolIdFromSlug(slug: string): Promise<string | null> {
  const { data } = await supabasePublic
    .from('schools')
    .select('id')
    .eq('slug', slug)
    .single()

  return data?.id || null
}

/**
 * Check if a slug is available for new school registration
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabasePublic
    .from('schools')
    .select('id')
    .eq('slug', slug)
    .single()

  return !data
}
