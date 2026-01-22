import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Public Supabase client for unauthenticated operations.
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Creates an authenticated Supabase client with a Clerk JWT.
 * @param token The JWT obtained from Clerk's useAuth().getToken({ template: 'supabase' })
 */
export function getSupabaseClient(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// Client-side file upload utility
export async function uploadFileClient(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  const { error } = await supabasePublic.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('Upload error:', error.message)
    return null
  }

  const { data } = supabasePublic.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
