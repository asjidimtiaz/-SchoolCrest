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
        const msg = type === 'team' 
            ? 'Are you sure you want to delete this team? All seasons will also be deleted.' 
            : 'Are you sure you want to delete this season?';
        
        if (confirm(msg)) {
          startTransition(async () => {
            if (type === 'team') {
                await deleteTeam(id)
            } else {
                await deleteSeason(id, teamId!)
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
