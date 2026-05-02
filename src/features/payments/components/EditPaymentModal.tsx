import { useState } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { updatePaymentOptions } from '@/features/payments/api/payment-mutations'
import { paymentKeys } from '@/features/payments/queries'
import type { PaymentRow, StatusPlata, TipPlata } from '@/features/payments/types'
import { focusInitialModalControl, handleModalKeyboard } from '@/shared/modal-keyboard'

export type { PaymentRow }

const NOTA_MAX = 100

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

function Select<T extends string>({ value, onChange, options, disabled }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      disabled={disabled}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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
  const [nota, setNota] = useState(payment.nota ?? '')

  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...updatePaymentOptions(payment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      toast.success('Plată actualizată cu succes.')
      onClose()
    },
  })

  const isDirty =
    Number(suma) !== payment.suma ||
    status !== payment.status ||
    tip !== payment.tip ||
    dataScadenta !== payment.data_scadenta ||
    nota !== (payment.nota ?? '')

  function handleClose() {
    if (mutation.isPending) return
    onClose()
  }

  function handleSave() {
    const sumaNum = Number(suma)
    if (!sumaNum || sumaNum <= 0) return
    mutation.mutate({
      suma: sumaNum,
      tip,
      status,
      data_scadenta: dataScadenta,
      nota: nota.trim() || null,
      modified_at: new Date().toISOString(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={e => handleModalKeyboard(e, handleClose)}
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Editează plată #{payment.id}</h2>
            {payment.client_denumire && (
              <p className="text-xs text-muted-foreground mt-0.5">{payment.client_denumire}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            disabled={mutation.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
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
                disabled={mutation.isPending}
                ref={focusInitialModalControl}
              />
            </Field>
            <Field label="Scadență">
              <Input
                type="date"
                value={dataScadenta}
                onChange={e => setDataScadenta(e.target.value)}
                disabled={mutation.isPending}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tip plată">
              <Select<TipPlata>
                value={tip}
                onChange={setTip}
                disabled={mutation.isPending}
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
                disabled={mutation.isPending}
                options={[
                  { value: 'in_lucru', label: 'În lucru' },
                  { value: 'platit', label: 'Plătit' },
                  { value: 'depasit', label: 'Depășit' },
                  { value: 'anulat', label: 'Anulat' },
                ]}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Notă</label>
              <span className={cn(
                'text-xs tabular-nums',
                nota.length >= NOTA_MAX ? 'text-destructive font-medium' : 'text-muted-foreground/60',
              )}>
                {nota.length}/{NOTA_MAX}
              </span>
            </div>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value.slice(0, NOTA_MAX))}
              rows={2}
              placeholder="Opțional..."
              disabled={mutation.isPending}
              className={cn(
                'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'resize-none disabled:opacity-50',
              )}
            />
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={mutation.isPending}>
            Anulează
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!isDirty || !suma || Number(suma) <= 0 || mutation.isPending}
            loading={mutation.isPending}
          >
            {mutation.isPending ? 'Se salvează...' : 'Salvează'}
          </Button>
        </div>
      </div>
    </div>
  )
}
