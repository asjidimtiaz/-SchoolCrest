'use client'

import { Trash2 } from 'lucide-react'
import { deleteTeam, deleteSeason } from './actions'
import { useTransition } from 'react'

interface DeleteButtonProps {
  id: string
  teamId?: string // If present, deleting a season
  type: 'team' | 'season'
}

export default function DeleteButton({ id, teamId, type }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!id || id === 'null') {
          alert('Error: This item has no valid ID and cannot be deleted. Please refresh the page.');
          return;
        }

        const msg = type === 'team'
          ? 'Are you sure you want to delete this team? All seasons will also be deleted.'
          : 'Are you sure you want to delete this season?';

        if (confirm(msg)) {
          startTransition(async () => {
            let result;
            if (type === 'team') {
              result = await deleteTeam(id)
            } else {
              result = await deleteSeason(id, teamId!)
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
