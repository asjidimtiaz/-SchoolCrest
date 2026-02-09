'use client'

import { X, FileText } from 'lucide-react'
import { ProgramRecord } from '@/lib/getPrograms'

interface RecordsViewModalProps {
    records: ProgramRecord[]
    programName: string
    onClose: () => void
}

export default function RecordsViewModal({ records, programName, onClose }: RecordsViewModalProps) {
    if (!records || records.length === 0) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-[3rem] shadow-premium overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                {/* Header */}
                <div className="flex items-center justify-between px-10 py-6 bg-white border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-12 bg-indigo-500 rounded-full" />
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Program Records</span>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{programName}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-sm border border-gray-100 group"
                    >
                        <X size={24} strokeWidth={3} className="text-gray-900 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <div className="grid grid-cols-1 gap-6">
                        {records.map((record, index) => (
                            <div key={record.id} className="group bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[2rem] border border-indigo-100 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-8">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight shrink-0">
                                        {record.name}
                                    </h3>
                                    {record.description && (
                                        <p className="text-base text-gray-700 leading-relaxed font-medium">
                                            {record.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {records.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                            <FileText size={64} strokeWidth={1} className="mb-4 opacity-30" />
                            <p className="text-sm font-black uppercase tracking-widest">No Records Available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
