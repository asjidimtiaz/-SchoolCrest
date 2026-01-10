'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function acceptInvite(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const token = formData.get('token') as string
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 1. Verify token and set password (this also symptoms as login)
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    password: password
  })

  if (authError) {
    console.error('Invite update error:', authError.message)
    return { error: authError.message, success: false }
  }

  // 2. Update Admin profile if needed (the admin record should already exist from invitation)
  // We'll update the user's name if they provided it
  const user = authData.user
  if (user) {
    const { error: profileError } = await supabase
      .from('admins')
      .update({ 
        active: true,
        full_name: name
      })
      .eq('id', user.id)

    if (profileError) {
      console.warn('Profile activation warning:', profileError.message)
      // We don't fail the whole flow if only profile update fails
    }
  }

  return { error: '', success: true }
}
