'use client'

import { useState, useTransition } from 'react'
import { UserCheck, UserX, Trash2, MoreVertical } from 'lucide-react'
import { toggleAdminStatus, deleteAdmin } from './actions'

interface AdminActionsProps {
  admin: {
    id: string
    email: string
    role: string
    active: boolean
    school_name: string
  }
  alignTop?: boolean
}

export default function AdminActions({ admin, alignTop = false }: AdminActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showMenu, setShowMenu] = useState(false)

  const handleToggleStatus = () => {
    startTransition(async () => {
      await toggleAdminStatus(admin.id, !admin.active)
      setShowMenu(false)
    })
  }


  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${admin.email}? This cannot be undone.`)) {
      startTransition(async () => {
        await deleteAdmin(admin.id)
        setShowMenu(false)
      })
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        disabled={isPending}
      >
        <MoreVertical size={18} className="text-gray-400" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className={`absolute right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden ${alignTop ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}>
            <button
              onClick={handleToggleStatus}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              {admin.active ? (
                <>
                  <UserX size={16} className="text-red-500" />
                  <span className="text-sm font-medium">Disable</span>
                </>
              ) : (
                <>
                  <UserCheck size={16} className="text-green-500" />
                  <span className="text-sm font-medium">Enable</span>
                </>
              )}
            </button>


            <div className="border-t border-gray-100" />

            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-600"
            >
              <Trash2 size={16} />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
