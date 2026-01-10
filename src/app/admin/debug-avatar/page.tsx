import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function DebugAvatarPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: admin } = await supabase
    .from('admins')
    .select('id, email, full_name, avatar_url')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Avatar Debug Info</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre className="text-xs overflow-auto">
          {JSON.stringify(admin, null, 2)}
        </pre>
      </div>
      
      {admin?.avatar_url && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Avatar URL Test:</h2>
          <p className="text-xs break-all mb-2">{admin.avatar_url}</p>
          <img src={admin.avatar_url} alt="Avatar" className="w-32 h-32 object-cover rounded-lg border" />
        </div>
      )}
    </div>
  )
}
