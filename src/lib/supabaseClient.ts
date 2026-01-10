import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Client-side file upload utility
export async function uploadFileClient(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (error) {
    console.error('Upload error:', error.message)
    return null
  }

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
