'use client'

import { Trash2 } from 'lucide-react'
import { deleteSchool } from '../actions'

export default function PurgeSchoolButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (window.confirm('CRITICAL: Are you absolutely sure you want to PURGE all data for this school? This action is irreversible and will remove all associated records from the ecosystem.')) {
        await deleteSchool(id)
    }
  }

  return (
    <button 
        onClick={handleDelete}
        className="flex items-center gap-3 px-8 py-5 bg-white border border-red-100 text-red-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all shadow-sm active:scale-95"
    >
        <Trash2 size={18} />
        Purge School Data
    </button>
  )
}
