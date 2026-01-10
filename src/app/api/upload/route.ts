import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Configure route to accept larger files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            try { cookieStore.set({ name, value, ...options }) } catch (e) {}
          },
          remove(name: string, options: CookieOptions) {
            try { cookieStore.set({ name, value: '', ...options }) } catch (e) {}
          },
        },
      }
    )

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'misc'
    const schoolId = formData.get('schoolId') as string

    if (!file || !schoolId) {
      return NextResponse.json({ error: 'Missing file or schoolId' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const path = `${folder}/${schoolId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('school-assets')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabase.storage.from('school-assets').getPublicUrl(path)
    
    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
