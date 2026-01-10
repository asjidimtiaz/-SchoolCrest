'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
