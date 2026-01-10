'use client'

import { useActionState, useEffect, useState } from 'react'
import { acceptInvite } from './actions'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const initialState = {
  error: '',
  success: false,
}

export default function AcceptInvitePage() {
  const [token, setToken] = useState<string | null>(null)
  
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(acceptInvite, initialState)

  useEffect(() => {
    // Read token from URL hash (standard Supabase invite format) or query params
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', '?'))
    const accessToken = params.get('access_token') || new URLSearchParams(window.location.search).get('token')
    
    if (accessToken) {
      setToken(accessToken)
    }
  }, [])

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100">
           <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
           </div>
           <h1 className="text-2xl font-black text-gray-900 mb-2">Invalid Invite</h1>
           <p className="text-gray-500 italic">No invitation token found in the URL. Please use the link provided in your email.</p>
        </div>
      </div>
    )
  }

  if (state.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100">
           <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
           </div>
           <h1 className="text-2xl font-black text-gray-900 mb-2">Account Ready</h1>
           <p className="text-gray-500 mb-8">Your admin account has been successfully activated. You can now sign in to the dashboard.</p>
           <a 
            href="/admin/login" 
            className="block w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-center"
           >
             Go to Login
           </a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Join SchoolCrest</h1>
            <p className="text-gray-500 mt-2 font-medium">Create your admin account</p>
          </div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="token" value={token} />
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Set Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider pl-1">Minimal 8 characters</p>
            </div>

            {state.error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Activate Account'
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400 font-medium">By activating, you agree to our Terms of Service.</p>
        </div>
      </div>
    </main>
  )
}
