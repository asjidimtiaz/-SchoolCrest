'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminAccount } from './actions'

interface CreateAdminFormProps {
  schools: Array<{ id: string; name: string; slug: string }>
}

const initialState = { error: '', success: false }

export default function CreateAdminForm({ schools }: CreateAdminFormProps) {
  const router = useRouter()
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(createAdminAccount, initialState)
  const [role, setRole] = useState('school_admin')

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/super/admins');
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
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
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
            Role
          </label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold appearance-none cursor-pointer"
          >
            <option value="school_admin">School Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {role === 'school_admin' && (
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Assign to School
            </label>
            <select
              name="school_id"
              required={role === 'school_admin'}
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
        )}

        {state?.error && (
          <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
            {state.error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-12 py-5 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Admin Account'}
        </button>
      </div>
    </form>
  )
}
