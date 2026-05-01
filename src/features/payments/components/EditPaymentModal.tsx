import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { PaymentRow, StatusPlata, TipPlata } from '@/features/payments/types'

export type { PaymentRow }

interface Props {
  payment: PaymentRow
  onClose: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function Select<T extends string>({ value, onChange, options }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function EditPaymentModal({ payment, onClose }: Props) {
  const [suma, setSuma] = useState(String(payment.suma))
  const [status, setStatus] = useState<StatusPlata>(payment.status)
  const [tip, setTip] = useState<TipPlata>(payment.tip)
  const [dataScadenta, setDataScadenta] = useState(payment.data_scadenta)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Editează plată #{payment.id}</h2>
            {payment.client_denumire && (
              <p className="text-xs text-muted-foreground mt-0.5">{payment.client_denumire}</p>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sumă (RON)">
              <Input
                type="number"
                min="0"
                value={suma}
                onChange={e => setSuma(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="Scadență">
              <Input
                type="date"
                value={dataScadenta}
                onChange={e => setDataScadenta(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tip plată">
              <Select<TipPlata>
                value={tip}
                onChange={setTip}
                options={[
                  { value: 'contractuala', label: 'Contractuală' },
                  { value: 'manuala', label: 'Manuală' },
                  { value: 'penalizare', label: 'Penalizare' },
                ]}
              />
            </Field>
            <Field label="Status">
              <Select<StatusPlata>
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'in_lucru', label: 'În lucru' },
                  { value: 'platit', label: 'Plătit' },
                  { value: 'depasit', label: 'Depășit' },
                  { value: 'anulat', label: 'Anulat' },
                ]}
              />
            </Field>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button className="flex-1" disabled={!suma}>
            Salvează
          </Button>
        </div>
      </div>
    </div>
  )
}
