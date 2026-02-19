'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react'
import MediaUpload from '@/components/MediaUpload'
import { uploadFileClient } from '@/lib/supabaseClient'

interface TrophyCaseItem {
    id: string
    title: string
    photo_url: string
}

interface TrophyCaseManagerProps {
    initialItems?: TrophyCaseItem[]
    onChange?: (items: TrophyCaseItem[]) => void
    schoolId: string
}

export default function TrophyCaseManager({ initialItems = [], onChange, schoolId }: TrophyCaseManagerProps) {
    const [items, setItems] = useState<TrophyCaseItem[]>(initialItems)
    const [editingItem, setEditingItem] = useState<TrophyCaseItem | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        photo_url: ''
    })

    const handleSave = () => {
        if (!formData.title.trim() || !formData.photo_url) return

        const newItem: TrophyCaseItem = {
            id: editingItem?.id || Math.random().toString(36).substr(2, 9),
            title: formData.title,
            photo_url: formData.photo_url
        }

        let newItems: TrophyCaseItem[]
        if (editingItem) {
            newItems = items.map(i => i.id === editingItem.id ? newItem : i)
        } else {
            newItems = [...items, newItem]
        }

        setItems(newItems)
        if (onChange) onChange(newItems)

        setFormData({ title: '', photo_url: '' })
        setEditingItem(null)
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        if (!confirm('Delete this trophy case item?')) return
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        if (onChange) onChange(newItems)
    }

    const startEdit = (item: TrophyCaseItem) => {
        setEditingItem(item)
        setFormData({
            title: item.title,
            photo_url: item.photo_url
        })
        setShowForm(true)
    }

    const cancelEdit = () => {
        setFormData({ title: '', photo_url: '' })
        setEditingItem(null)
        setShowForm(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Digital Trophy Case</h3>
                    <p className="text-[9px] text-gray-500 mt-0.5">Showcase prestigious awards and trophies (Image + Title)</p>
                </div>
                {!showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Add Item
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Item Title</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl outline-none font-bold text-sm"
                            placeholder="e.g., 2024 State Championship Trophy"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Photo</label>
                        <MediaUpload
                            name="trophy_photo"
                            currentMediaUrl={formData.photo_url}
                            onFileSelect={async (file) => {
                                if (!file) return;
                                setUploading(true);
                                try {
                                    const ext = file.name.split('.').pop();
                                    const path = `trophy_case/${schoolId}/${Date.now()}_item.${ext}`;
                                    const publicUrl = await uploadFileClient(file, 'school-assets', path);
                                    if (publicUrl) {
                                        setFormData(prev => ({ ...prev, photo_url: publicUrl }));
                                    }
                                } catch (err) {
                                    console.error("Upload failed", err);
                                } finally {
                                    setUploading(false);
                                }
                            }}
                            recommendation="Square or Portrait recommended (e.g., 800x1000px)"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2 text-emerald-600 hover:text-emerald-800 font-black text-[9px] uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={uploading || !formData.title.trim() || !formData.photo_url}
                            className="px-6 py-2 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition-all text-[9px] uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : editingItem ? 'Update' : 'Add'} Item
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg transition-all flex h-24">
                        <div className="w-24 h-full bg-gray-50 shrink-0 border-r border-gray-100">
                            <img src={item.photo_url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                            <h4 className="font-black text-xs text-gray-900 uppercase tracking-tight truncate">{item.title}</h4>
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => startEdit(item)}
                                className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-emerald-600 rounded-lg shadow-sm border border-gray-100 transition-all"
                            >
                                <Edit size={12} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-300 hover:text-red-600 rounded-lg shadow-sm border border-gray-100 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && !showForm && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100 text-gray-200">
                        <ImageIcon size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No trophy items added yet</p>
                </div>
            )}
        </div>
    )
}
