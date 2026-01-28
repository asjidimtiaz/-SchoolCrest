import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
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
