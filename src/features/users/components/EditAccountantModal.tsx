import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type Accountant = Database['public']['Tables']['CONTABIL']['Row']

interface Props {
  accountant: Accountant
  onClose: () => void
}

export function EditAccountantModal({ accountant, onClose }: Props) {
  const [denumire, setDenumire] = useState(accountant.denumire)
  const [email, setEmail] = useState(accountant.email ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Editează contabil</h2>
            <p className="text-xs text-muted-foreground mt-0.5">ID #{accountant.id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        {/* Conținut */}
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Info readonly */}
          <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              ID: <span className="text-foreground font-medium">#{accountant.id}</span>
              <span className="mx-2 text-border">·</span>
              Înregistrat la <span className="text-foreground">{new Date(accountant.created_at).toLocaleDateString('ro-RO')}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              User ID: <span className="font-mono text-foreground text-[10px]">{accountant.user_id ?? '—'}</span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Denumire / Nume</label>
            <Input value={denumire} onChange={e => setDenumire(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="—" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Salvează
          </Button>
        </div>
      </div>
    </div>
  )
}
