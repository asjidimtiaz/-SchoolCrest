import { supabaseAdmin } from '@/lib/supabaseAdmin'
import Link from 'next/link'
import { ArrowLeft, Building2, Palette, Upload, UserPlus, Check, ChevronRight } from 'lucide-react'
import SchoolOnboardingWizard from './SchoolOnboardingWizard'

export default async function NewSchoolPage() {
  // Get list of existing slugs for validation
  const { data: schools } = await supabaseAdmin
    .from('schools')
    .select('slug')

  const existingSlugs = schools?.map(s => s.slug) || []

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link 
          href="/admin/super" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black text-gray-900">Create New School</h1>
        <p className="text-gray-500 mt-1 font-medium">Set up a new school on the platform</p>
      </div>

      <SchoolOnboardingWizard existingSlugs={existingSlugs} />
    </div>
  )
}
