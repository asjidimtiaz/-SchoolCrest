'use client'

import { Trash2 } from 'lucide-react'
import { deleteEvent } from './actions'
import { useTransition } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to delete this event?')) {
          startTransition(async () => {
            await deleteEvent(id)
          })
        }
      }}
      disabled={isPending}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  )
}
