'use client'

import { Trash2 } from 'lucide-react'
import { deleteProgram, deleteSeason } from './actions'
import { useTransition } from 'react'

interface DeleteButtonProps {
  id: string
  programId?: string // If present, deleting a season
  type: 'program' | 'season'
}

export default function DeleteButton({ id, programId, type }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!id || id === 'null') {
          alert('Error: This item has no valid ID and cannot be deleted. Please refresh the page.');
          return;
        }

        const msg = type === 'program'
          ? 'Are you sure you want to delete this program? All seasons will also be deleted.'
          : 'Are you sure you want to delete this season?';

        if (confirm(msg)) {
          startTransition(async () => {
            let result;
            if (type === 'program') {
              result = await deleteProgram(id)
            } else {
              result = await deleteSeason(id, programId!)
            }

            if (result?.success) {
              // Success - the transition will trigger a re-render via revalidatePath
            } else if (result?.error) {
              alert(result.error)
            }
          })
        }
      }}
      disabled={isPending}
      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50 active:scale-90"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  )
}
