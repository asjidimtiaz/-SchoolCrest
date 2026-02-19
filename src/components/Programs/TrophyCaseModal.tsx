'use client'

import { X, Trophy } from 'lucide-react'
import { useBranding } from '@/context/BrandingContext'

interface TrophyCaseItem {
    id: string
    title: string
    photo_url: string
}

interface TrophyCaseModalProps {
    items: TrophyCaseItem[]
    programName: string
    onClose: () => void
}

export default function TrophyCaseModal({ items, programName, onClose }: TrophyCaseModalProps) {
    const branding = useBranding()

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 md:p-12 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-7xl max-h-full bg-[#FAFAFA] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-700 border border-white/20"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between px-12 py-8 bg-white border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-2 h-12 rounded-full" style={{ backgroundColor: branding.primaryColor }} />
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Honors & Awards</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">{programName} Trophy Case</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-16 h-16 rounded-3xl bg-gray-50 hover:bg-black hover:text-white flex items-center justify-center transition-all group shrink-0"
                    >
                        <X size={32} className="text-slate-900 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group flex flex-col bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Photo Container */}
                                    <div className="aspect-[4/5] w-full bg-slate-50 relative overflow-hidden">
                                        {/* Blurred Background */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
                                            style={{ backgroundImage: `url(${item.photo_url})` }}
                                        />
                                        <img
                                            src={item.photo_url}
                                            alt={item.title}
                                            className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Title Footer */}
                                    <div className="p-8 text-center bg-white border-t border-gray-50 flex-1 flex items-center justify-center">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-2">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Accent Line */}
                                    <div className="h-1.5 w-full" style={{ backgroundColor: branding.primaryColor }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100">
                                <Trophy size={48} strokeWidth={1} />
                            </div>
                            <p className="text-xl font-black text-gray-400 uppercase tracking-[0.2em]">Our trophy case is currently being updated</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
