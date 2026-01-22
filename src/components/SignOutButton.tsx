'use client'

import { useClerk } from '@clerk/nextjs'

export default function SignOutButton() {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <button
      onClick={handleSignOut}
      className="block w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
    >
      Sign Out
    </button>
  )
}
