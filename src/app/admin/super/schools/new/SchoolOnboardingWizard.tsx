'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Palette, Upload, UserPlus, Check, ChevronRight, ChevronLeft, Globe } from 'lucide-react'
import { createSchoolWithBranding } from './actions'

interface SchoolOnboardingWizardProps {
  existingSlugs: string[]
}

const steps = [
  { id: 1, title: 'Basic Info', icon: Building2 },
  { id: 2, title: 'Branding', icon: Palette },
  { id: 3, title: 'Review', icon: Check },
]

export default function SchoolOnboardingWizard({ existingSlugs }: SchoolOnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    is_demo: false,
    primary_color: '#1a1a1a',
    secondary_color: '#ffffff',
    accent_color: '#3b82f6',
    tagline: '',
  })

  const [slugError, setSlugError] = useState('')

  const validateSlug = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (existingSlugs.includes(cleanSlug)) {
      setSlugError('This subdomain is already taken')
      return false
    }
    if (cleanSlug.length < 3) {
      setSlugError('Subdomain must be at least 3 characters')
      return false
    }
    setSlugError('')
    return true
  }

  const handleSlugChange = (value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData({ ...formData, slug: cleanSlug })
    validateSlug(cleanSlug)
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.length >= 2 && formData.slug.length >= 3 && !slugError
    }
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    const form = new FormData()
    form.append('name', formData.name)
    form.append('slug', formData.slug)
    form.append('is_demo', formData.is_demo.toString())
    form.append('primary_color', formData.primary_color)
    form.append('secondary_color', formData.secondary_color)
    form.append('accent_color', formData.accent_color)
    form.append('tagline', formData.tagline)

    const result = await createSchoolWithBranding(null, form)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/admin/super')
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${
              currentStep === step.id 
                ? 'bg-black text-white' 
                : currentStep > step.id 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              <step.icon size={20} />
              <span className="font-bold text-sm">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight size={20} className="text-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                School Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-lg"
                placeholder="e.g. Oakridge High School"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Subdomain (URL Slug)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`flex-1 px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold ${
                    slugError ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="e.g. oakridge"
                />
                <span className="text-gray-500 font-medium">.schoolcrestinteractive.com</span>
              </div>
              {slugError && <p className="text-red-500 text-sm mt-2 font-medium">{slugError}</p>}
              {formData.slug && !slugError && (
                <p className="text-green-600 text-sm mt-2 font-medium flex items-center gap-2">
                  <Globe size={14} />
                  {formData.slug}.schoolcrestinteractive.com is available!
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Tagline (Optional)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium"
                placeholder="e.g. Excellence in Education Since 1985"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_demo}
                onChange={(e) => setFormData({ ...formData, is_demo: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="font-bold text-gray-700">Mark as Demo School</span>
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <p className="text-gray-500 mb-6">Choose your school colors. These will be used throughout the kiosk interface.</p>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-16 h-16 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-16 h-16 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-16 h-16 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-8 p-6 rounded-2xl border border-gray-100" style={{ backgroundColor: formData.secondary_color }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: formData.primary_color }} />
                <div>
                  <h3 className="font-black text-lg" style={{ color: formData.primary_color }}>{formData.name || 'School Name'}</h3>
                  <p className="text-sm" style={{ color: formData.accent_color }}>{formData.tagline || 'Your tagline here'}</p>
                </div>
              </div>
              <button className="px-6 py-3 rounded-xl font-bold text-white" style={{ backgroundColor: formData.primary_color }}>
                Sample Button
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 mb-6">Review & Create</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">School Name</p>
                  <p className="text-lg font-bold text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Subdomain</p>
                  <p className="text-lg font-bold text-gray-900">{formData.slug}.schoolcrestinteractive.com</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</p>
                  <p className="text-lg font-bold text-gray-900">{formData.is_demo ? 'Demo' : 'Production'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Colors</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl border border-gray-200 mb-2" style={{ backgroundColor: formData.primary_color }} />
                    <p className="text-xs font-medium text-gray-500">Primary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl border border-gray-200 mb-2" style={{ backgroundColor: formData.secondary_color }} />
                    <p className="text-xs font-medium text-gray-500">Secondary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl border border-gray-200 mb-2" style={{ backgroundColor: formData.accent_color }} />
                    <p className="text-xs font-medium text-gray-500">Accent</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 text-gray-400 font-bold disabled:opacity-30"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-gray-800 transition-all"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-green-700 transition-all"
          >
            {isSubmitting ? 'Creating...' : 'Create School'}
            <Check size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
