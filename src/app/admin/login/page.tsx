'use client'

import { login } from './actions'
import { useActionState } from 'react'
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react'

const initialState = {
  error: '',
}

export default function LoginPage() {
    // @ts-ignore - useActionState type definition might vary in Next 15 canary
    const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-sm w-full relative">
        {/* Glass Card */}
        <div className="glass-card rounded-[2rem] border-none shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 border border-white/20 shadow-xl overflow-hidden p-2">
                <img src="/school-crest-logo.png" alt="School Crest Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Administrator Access</h1>
              <p className="text-white/70 text-sm font-medium">Secure portal for content management</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 bg-white/50 backdrop-blur-sm">
            <form action={formAction} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/10 focus:border-black transition-all outline-none font-medium text-sm placeholder:text-gray-400 shadow-sm"
                    placeholder="admin@school.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/10 focus:border-black transition-all outline-none font-medium text-sm placeholder:text-gray-400 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              {state?.error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-slide-up flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="group w-full py-3.5 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-sm mt-6"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 bg-white/30 backdrop-blur-sm border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield size={12} className="text-gray-400" />
              <span className="font-medium">For access, contact your system administrator</span>
            </div>
          </div>
        </div>

        {/* Powered By */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-400 font-medium">
            Powered by <span className="font-black text-gray-600">School Crest Interactive</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}
