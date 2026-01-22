'use client'

import { Trash2 } from 'lucide-react'
import { deleteSchool } from '../actions'

export default function PurgeSchoolButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (window.confirm('DANGER: Are you sure you want to PERMANENTLY DELETE this school? This will remove the school account, all admins, all data, and the subdomain. This cannot be undone.')) {
        await deleteSchool(id)
    }
  }

  return (
    <button 
        onClick={handleDelete}
        className="flex items-center gap-3 px-8 py-5 bg-white border border-red-100 text-red-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all shadow-sm active:scale-95"
    >
        <Trash2 size={18} />
        Delete School Permanently
    </button>
  )
}
