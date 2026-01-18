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

          <div className="space-y-2 pt-4 border-t border-gray-50">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Google Cloud API Key</label>
            <div className="relative group">
              <Save className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="google_api_key"
                defaultValue={school.google_api_key || ''}
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                placeholder="Enter your Google Cloud API Key..."
              />
            </div>
            <p className="text-[9px] text-gray-400 font-medium ml-1">
              Required to fetch events and display them as native cards. Get one from the Google Cloud Console.
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

      {/* INSTRUCTION GUIDE FOR ADMINS */}
      <section className="bg-blue-50/30 p-8 rounded-[1.5rem] border border-blue-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-blue-900">Setup Guide</h2>
            <p className="text-[10px] text-blue-600 font-medium tracking-tight">Follow these steps to enable native calendar cards.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Getting the API Key */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              Get your API Key
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Visit Google Cloud Console", link: "https://console.cloud.google.com/" },
                { text: "Create a 'New Project' and name it 'SchoolCrest'." },
                { text: "Search for 'Google Calendar API' and click 'Enable'." },
                { text: "Go to 'Credentials', click '+ Create Credentials' and select 'API Key'." }
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-tight">
                    {step.text} {step.link && <a href={step.link} target="_blank" className="underline font-bold">here</a>}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Step 2: Making it Public */}
          <div className="space-y-4 border-l border-blue-100/50 pl-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Make Calendar Public
            </h3>
            <p className="text-[11px] text-blue-700 leading-normal">
              For native cards to display, the calendar must be viewable by the public:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-blue-100">
                <div className="mt-1 w-3 h-3 rounded bg-blue-500 flex items-center justify-center shrink-0">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <p className="text-[10px] text-blue-900 font-medium">
                  Go to Calendar Settings {' > '} Access permissions {' > '} Check <strong>"Make available to public"</strong>.
                </p>
              </li>
            </ul>
            <p className="text-[10px] text-blue-400 font-medium italic">
              * Native cards are more reliable and match the school's branding better than standard embeds.
            </p>
          </div>
        </div>
      </section>

      {state?.error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black border border-red-100">
          {state.error}
        </div>
      )}
    </form>
  )
}
