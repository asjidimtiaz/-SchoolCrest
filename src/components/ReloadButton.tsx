'use client'

export default function ReloadButton() {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="block w-full py-4 px-6 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors"
    >
      Try Again
    </button>
  )
}
