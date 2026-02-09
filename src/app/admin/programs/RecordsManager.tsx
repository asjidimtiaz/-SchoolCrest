'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, FileText, X } from 'lucide-react'

interface ProgramRecord {
    id: string
    name: string
    description: string
}

interface RecordsManagerProps {
    initialRecords?: ProgramRecord[]
    onChange?: (records: ProgramRecord[]) => void
}

export default function RecordsManager({ initialRecords = [], onChange }: RecordsManagerProps) {
    const [records, setRecords] = useState<ProgramRecord[]>(initialRecords)
    const [editingRecord, setEditingRecord] = useState<ProgramRecord | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    const handleSave = () => {
        if (!formData.name.trim()) return

        const newRecord: ProgramRecord = {
            id: editingRecord?.id || Math.random().toString(36).substr(2, 9),
            name: formData.name,
            description: formData.description
        }

        let newRecords: ProgramRecord[]
        if (editingRecord) {
            newRecords = records.map(r => r.id === editingRecord.id ? newRecord : r)
        } else {
            newRecords = [...records, newRecord]
        }

        setRecords(newRecords)
        if (onChange) onChange(newRecords)

        setFormData({ name: '', description: '' })
        setEditingRecord(null)
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this record?')) return
        const newRecords = records.filter(r => r.id !== id)
        setRecords(newRecords)
        if (onChange) onChange(newRecords)
    }

    const startEdit = (record: ProgramRecord) => {
        setEditingRecord(record)
        setFormData({
            name: record.name,
            description: record.description
        })
        setShowForm(true)
    }

    const cancelEdit = () => {
        setFormData({ name: '', description: '' })
        setEditingRecord(null)
        setShowForm(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Individual Program Records</h3>
                    <p className="text-[9px] text-gray-500 mt-0.5">Notable achievements, milestones, or individuals</p>
                </div>
                {!showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Add Record
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Record Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 bg-white border-2 border-indigo-200 focus:border-indigo-500 rounded-xl outline-none font-bold text-sm"
                            placeholder="e.g., John Doe - State Champion"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 bg-white border-2 border-indigo-200 focus:border-indigo-500 rounded-xl outline-none font-medium text-sm resize-none"
                            placeholder="Details about this achievement or milestone..."
                        />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-black text-[9px] uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!formData.name.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-700 transition-all text-[9px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {editingRecord ? 'Update' : 'Add'} Record
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {records.map((record) => (
                    <div key={record.id} className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                            <FileText size={18} className="text-indigo-600" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight">{record.name}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{record.description}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => startEdit(record)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(record.id)}
                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {records.length === 0 && !showForm && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100">
                        <FileText size={20} className="text-gray-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No records added yet</p>
                </div>
            )}
        </div>
    )
}
