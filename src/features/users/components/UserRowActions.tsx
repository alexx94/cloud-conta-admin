import { useState } from 'react'
import { Pencil, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserRowActionsProps {
  onEdit: () => void
  email: string | null
  displayName: string
}

export function UserRowActions({ onEdit, email }: UserRowActionsProps) {
  const [resetSent, setResetSent] = useState(false)

  return (
    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <Button
        variant="ghost"
        size="sm"
        className="w-full sm:w-auto"
        onClick={onEdit}
      >
        <Pencil className="size-3.5" />
        Editează
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={!email || resetSent}
        onClick={() => setResetSent(true)}
        title={!email ? 'Utilizator fără email' : undefined}
      >
        <RotateCcw className="size-3.5" />
        {resetSent ? 'Email trimis' : 'Reset parolă'}
      </Button>
    </div>
  )
}
