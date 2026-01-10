'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Building2 } from 'lucide-react'
import { sendAdminInvite } from './actions'

interface InviteAdminFormProps {
  schools: Array<{ id: string; name: string; slug: string }>
}

export default function InviteAdminForm({ schools }: InviteAdminFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError('')
    
    const result = await sendAdminInvite(null, formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 3000)
    }
    
    setIsSubmitting(false)
  }

  return (
    <form action={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
          placeholder="admin@school.com"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Assign to School
        </label>
        <select
          name="school_id"
          required
          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold appearance-none cursor-pointer"
        >
          <option value="">Select a school...</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name} ({school.slug})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          Role
        </label>
        <select
          name="role"
          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold appearance-none cursor-pointer"
        >
          <option value="school_admin">School Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100">
          ✓ Invite sent successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-gray-800 transition-all"
      >
        <Send size={20} />
        {isSubmitting ? 'Sending...' : 'Send Invite'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Invite link expires in 72 hours
      </p>
    </form>
  )
}
