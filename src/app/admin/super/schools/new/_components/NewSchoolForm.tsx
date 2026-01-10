'use client'

import { useActionState, useEffect } from 'react'
import { createSchool } from '../../../actions'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

const initialState = { error: '', success: false, schoolId: '' }

export default function NewSchoolForm() {
  const router = useRouter()
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(createSchool, initialState)

  useEffect(() => {
    if (state?.success) {
      alert('School created successfully!')
      router.push('/admin/super')
      router.refresh()
    }
  }, [state?.success, router])

  return (
    <form action={formAction} className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div>
        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">School Name</label>
        <input
          name="name"
          required
          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-lg"
          placeholder="e.g. Oakridge High School"
        />
      </div>

      <div>
        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Subdomain (Slug)</label>
        <div className="flex items-center gap-3">
            <input
              name="slug"
              required
              className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium text-lg"
              placeholder="e.g. oakridge"
            />
            <span className="text-gray-400 font-bold">.schoolcrestinteractive.com</span>
        </div>
        <p className="mt-2 text-xs text-gray-400 font-medium">This will be the unique URL for this school's kiosk.</p>
      </div>

      <div className="pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="is_demo"
            value="true"
            className="w-6 h-6 rounded-lg border-2 border-gray-200 checked:bg-black checked:border-black transition-all cursor-pointer"
          />
          <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Mark as Demo School</span>
        </label>
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          {state.error}
        </div>
      )}

      <div className="pt-8">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            <Save size={24} />
            {isPending ? 'Creating...' : 'Create & Initialize'}
          </button>
      </div>
    </form>
  )
}
