import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('[CRITICAL] Supabase environment variables are missing! Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: async (url, options) => {
        try {
          return await fetch(url, options);
        } catch (e: any) {
          console.error(`[CRITICAL] supabaseAdmin fetch failed for ${url}:`, e.message);
          throw e;
        }
      },
    },
  }
)
