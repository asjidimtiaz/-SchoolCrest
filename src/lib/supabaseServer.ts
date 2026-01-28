import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates an authenticated Supabase client using a Clerk JWT.
 * This should be used in Server Components, Server Actions, and Route Handlers.
 */
export async function getSupabaseServer() {
  try {
    const { getToken } = await auth()

    // Custom token template must be named 'supabase' in the Clerk Dashboard
    const token = await getToken({ template: 'supabase' })

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        },
      }
    )
  } catch (error) {
    console.warn('[getSupabaseServer] Failed to get Clerk token (JWT template may not be configured):', error instanceof Error ? error.message : error)
    console.warn('[getSupabaseServer] Falling back to public client. Admin features may not work correctly.')

    // Fallback to public client if Clerk token fails
    // This allows the app to run but admin features won't work properly
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    )
  }
}

/**
 * Public, unauthenticated Supabase client for public data fetching.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  {
    auth: {
      persistSession: false,
    },
  }
)
