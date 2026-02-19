'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    School,
    Save,
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Quote
} from 'lucide-react'
import { updateSchoolInfo } from './actions'

interface SchoolInfoFormProps {
    school: any
}

export default function SchoolInfoForm({ school }: SchoolInfoFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [actionState, setActionState] = useState({ error: '', success: false })

    const [formData, setFormData] = useState({
        name: school.name || '',
        tagline: school.tagline || '',
        about_text: school.about_text || '',
        about_text_show_marks: school.about_text_show_marks || false,
        about_quote: school.about_quote || '',
        about_quote_author: school.about_quote_author || '',
        about_quote_show_marks: school.about_quote_show_marks || false,
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
        website_url: school.website_url || '',
        facebook_url: school.facebook_url || '',
        instagram_url: school.instagram_url || '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setFormData(prev => ({ ...prev, [name]: val }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsPending(true)
        setActionState({ error: '', success: false })

        const rawData = new FormData()
        rawData.append('id', school.id)
        Object.entries(formData).forEach(([key, value]) => {
            rawData.append(key, String(value))
        })

        const result = await updateSchoolInfo(rawData)
        if (result.success) {
            setActionState({ error: '', success: true })
            router.refresh()
        } else {
            setActionState({ error: result.error || 'Update failed', success: false })
        }
        setIsPending(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-32">
            {/* SECTION: ACADEMIC IDENTITY */}
            <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <School size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Academic Identity</h2>
                        <p className="text-[10px] text-gray-400 font-medium">Core naming and mission statements.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Institution Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Motto / Tagline</label>
                        <input
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">About the School</label>
                            <textarea
                                name="about_text"
                                value={formData.about_text}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black resize-none"
                            />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="about_text_show_marks" checked={formData.about_text_show_marks} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">Wrap description in quote marks</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* SECTION: INSPIRATIONAL QUOTE */}
            <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                        <Quote size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Featured Mission Quote</h2>
                </div>
                <div className="space-y-6">
                    <textarea
                        name="about_quote"
                        value={formData.about_quote}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-bold italic text-sm outline-none focus:border-black"
                        placeholder="Inspirational quote..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Quote Author</label>
                            <input name="about_quote_author" value={formData.about_quote_author} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:border-black" />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group mb-4">
                            <input type="checkbox" name="about_quote_show_marks" checked={formData.about_quote_show_marks} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">Show marks for quote</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* SECTION: CONTACT & CONNECT */}
            <section className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100/50">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                    <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                        <MapPin size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">Contact & Digital Connect</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { name: 'address', icon: MapPin, label: 'Campus Address', placeholder: '123 Education Ln...' },
                        { name: 'phone', icon: Phone, label: 'Office Phone', placeholder: '(555) 000-0000' },
                        { name: 'email', icon: Mail, label: 'Public Email', placeholder: 'info@school.edu' },
                        { name: 'website_url', icon: Globe, label: 'School Website', placeholder: 'https://...' },
                        { name: 'facebook_url', icon: Facebook, label: 'Facebook URL', placeholder: 'https://...' },
                        { name: 'instagram_url', icon: Instagram, label: 'Instagram URL', placeholder: 'https://...' },
                    ].map(field => (
                        <div key={field.name} className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">{field.label}</label>
                            <div className="relative">
                                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    name={field.name}
                                    value={(formData as any)[field.name]}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black font-medium"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="fixed bottom-6 right-6 z-50">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-3 px-10 py-4 bg-black text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isPending ? 'Updating...' : 'Save School Info'}</span>
                </button>
                {actionState.error && <p className="mt-2 text-[10px] font-bold text-red-500 bg-white p-2 rounded-lg shadow-xl">{actionState.error}</p>}
                {actionState.success && <p className="mt-2 text-[10px] font-bold text-green-500 bg-white p-2 rounded-lg shadow-xl">Saved successfully!</p>}
            </div>
        </form>
    )
}
