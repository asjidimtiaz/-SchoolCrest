'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateCalendarUrl } from './actions'
import { useRouter } from 'next/navigation'
import { Globe, Save } from 'lucide-react'

interface CalendarFormProps {
  school: any
}

const initialState = { error: '', success: false }

export default function CalendarForm({ school }: CalendarFormProps) {
  const router = useRouter()
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(updateCalendarUrl, initialState)
  const [calendarUrl, setCalendarUrl] = useState(school.calendar_url || '')

  useEffect(() => {
    if (state?.success) {
      alert('Calendar URL updated successfully!')
      router.refresh()
    }
  }, [state?.success, router])

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={school.id} />

      {/* SECTION: GOOGLE CALENDAR INTEGRATION */}
      <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">External Integrations</h2>
            <p className="text-[10px] text-gray-400 font-medium">Connect external services like Google Calendar.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Google Calendar Embed URL</label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="calendar_url"
                value={calendarUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  // Auto-extract src if iframe code is pasted
                  if (val.includes('<iframe') || val.includes('src=')) {
                    const match = val.match(/src="([^"]+)"/);
                    if (match && match[1]) {
                      setCalendarUrl(match[1]);
                      return;
                    }
                  }
                  setCalendarUrl(val);
                }}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                placeholder="Paste the full <iframe> embed code or URL..."
              />
            </div>
            <p className="text-[9px] text-gray-400 font-medium ml-1">
              Supports full <code className="bg-gray-100 px-1 rounded">iframe</code> embed code or direct <code className="bg-gray-100 px-1 rounded">src</code> URL.
            </p>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 text-[11px] uppercase tracking-widest"
        >
          <Save size={14} />
          {isPending ? 'Saving...' : 'Save Calendar URL'}
        </button>
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100">
          {state.error}
        </div>
      )}
    </form>
  )
}
