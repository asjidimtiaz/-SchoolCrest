import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function PlatformSettingsPage() {
  const { data: settings } = await supabaseAdmin
    .from('platform_settings')
    .select('*')
    .order('key')

  // Convert settings array to object for easier access
  const settingsMap = settings?.reduce((acc: any, setting) => {
    acc[setting.key] = setting
    return acc
  }, {}) || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Configure global defaults and platform-wide settings</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-8">
        {/* Platform Info */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Platform Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Platform Name
              </label>
              <input
                type="text"
                defaultValue={settingsMap.platform_name?.value || 'SchoolCrest Interactive'}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
                disabled
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">Displayed in the admin interface footer</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Security & Session</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Inactivity Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue={parseInt(settingsMap.inactivity_timeout?.value || '15')}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
                disabled
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">Global timeout for inactive kiosk sessions</p>
            </div>
          </div>
        </div>

        {/* Default Branding */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Default Branding Fallbacks</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  defaultValue={settingsMap.default_primary_color?.value || '#000000'}
                  className="h-12 w-20 rounded-xl border border-gray-200 cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  defaultValue={settingsMap.default_primary_color?.value || '#000000'}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  defaultValue={settingsMap.default_secondary_color?.value || '#ffffff'}
                  className="h-12 w-20 rounded-xl border border-gray-200 cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  defaultValue={settingsMap.default_secondary_color?.value || '#ffffff'}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  defaultValue={settingsMap.default_accent_color?.value || '#ffd700'}
                  className="h-12 w-20 rounded-xl border border-gray-200 cursor-pointer"
                  disabled
                />
                <input
                  type="text"
                  defaultValue={settingsMap.default_accent_color?.value || '#ffd700'}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  disabled
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 font-medium">
            These colors are used for new schools and as fallbacks when school-specific branding is unavailable
          </p>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <p className="text-sm text-blue-800 font-bold">
            📝 Platform settings are read-only in this view. Editing functionality will be added in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
