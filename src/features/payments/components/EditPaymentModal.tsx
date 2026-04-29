import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type StatusPlata = Database['public']['Enums']['status_plata_enum']
type MetodaPlata = Database['public']['Enums']['metoda_plata_enum']

export type PaymentRow = {
  id: number
  suma: number
  status: StatusPlata
  tip: Database['public']['Enums']['tip_plata_enum']
  data_emitere: string
  data_scadenta: string
  data_plata: string | null
  metoda: MetodaPlata | null
  nota: string | null
  contract_servicii: number | null
  client_denumire: string | null
  client_cif: string | null
}

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

function Select({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function EditPaymentModal({ payment, onClose }: Props) {
  const [suma, setSuma] = useState(String(payment.suma))
  const [status, setStatus] = useState<StatusPlata>(payment.status)
  const [dataScadenta, setDataScadenta] = useState(payment.data_scadenta)
  const [dataPlata, setDataPlata] = useState(payment.data_plata ?? '')
  const [metoda, setMetoda] = useState<MetodaPlata | ''>(payment.metoda ?? '')
  const [nota, setNota] = useState(payment.nota ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md flex flex-col">
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
            <Field label="Status">
              <Select
                value={status}
                onChange={v => setStatus(v as StatusPlata)}
                options={[
                  { value: 'in_lucru', label: 'În lucru' },
                  { value: 'platit', label: 'Plătit' },
                  { value: 'depasit', label: 'Depășit' },
                  { value: 'anulat', label: 'Anulat' },
                ]}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Scadență">
              <Input type="date" value={dataScadenta} onChange={e => setDataScadenta(e.target.value)} />
            </Field>
            <Field label="Dată plată">
              <Input type="date" value={dataPlata} onChange={e => setDataPlata(e.target.value)} />
            </Field>
          </div>

          <Field label="Metodă plată">
            <Select
              value={metoda}
              onChange={v => setMetoda(v as MetodaPlata | '')}
              placeholder="— nicio metodă —"
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'transfer_bancar', label: 'Transfer bancar' },
                { value: 'card', label: 'Card' },
                { value: 'compensare', label: 'Compensare' },
                { value: 'altele', label: 'Altele' },
              ]}
            />
          </Field>

          <Field label="Notă">
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              rows={2}
              placeholder="opțional..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </Field>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button className="flex-1" onClick={onClose} disabled={!suma}>
            Salvează
          </Button>
        </div>
      </div>
    </div>
  )
}
