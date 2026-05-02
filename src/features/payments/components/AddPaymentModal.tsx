import { useState } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchPicker, type PickerOption } from '@/components/ui/search-picker'
import { cn } from '@/lib/utils'
import { clientPickerOptions, clientContractOptions, paymentKeys } from '@/features/payments/queries'
import { createPaymentOptions } from '@/features/payments/api/payment-mutations'
import type { TipPlata } from '@/features/payments/types'

interface Props {
  onClose: () => void
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export function AddPaymentModal({ onClose }: Props) {
  const [client, setClient] = useState<PickerOption | null>(null)
  const [contractId, setContractId] = useState<number | null>(null)
  const [suma, setSuma] = useState('')
  const [tip, setTip] = useState<TipPlata>('manuala')
  const [dataEmitere, setDataEmitere] = useState(() => new Date().toISOString().split('T')[0])
  const [dataScadenta, setDataScadenta] = useState('')
  const [nota, setNota] = useState('')

  const queryClient = useQueryClient()

  const { data: contracts = [], isLoading: contractsLoading } = useQuery(
    clientContractOptions(client?.id ?? null)
  )

  const effectiveContractId = contracts.length === 1 ? contracts[0].id : contractId

  function handleClientChange(opt: PickerOption | null) {
    setClient(opt)
    setContractId(null)
  }

  const mutation = useMutation({
    ...createPaymentOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      toast.success('Plată adăugată cu succes.')
      onClose()
    },
  })

  function handleClose() {
    if (mutation.isPending) return
    onClose()
  }

  const canSubmit = !!effectiveContractId && !!suma && Number(suma) > 0 && !!dataScadenta

  function handleSubmit() {
    if (!effectiveContractId || !canSubmit) return
    mutation.mutate({
      contract_servicii: effectiveContractId,
      suma: Number(suma),
      tip,
      status: 'in_lucru',
      data_emitere: dataEmitere,
      data_scadenta: dataScadenta,
      nota: nota || null,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      onKeyDown={e => { if (e.key === 'Escape') handleClose() }}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Plată manuală</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Adaugă o plată pentru un contract activ</p>
          </div>
          <button
            onClick={handleClose}
            disabled={mutation.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-4 min-h-[260px]">
          <Field label="Client" required>
            <SearchPicker
              value={client}
              onChange={handleClientChange}
              searchPlaceholder="Caută client după denumire sau CIF..."
              queryOptions={clientPickerOptions}
            />
          </Field>

          {client && (
            <>
              {contractsLoading && (
                <p className="text-sm text-muted-foreground">Se încarcă contractele...</p>
              )}
              {!contractsLoading && contracts.length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Clientul nu are contracte active.
                </p>
              )}
              {!contractsLoading && contracts.length === 1 && (
                <Field label="Contract">
                  <div className="h-9 flex items-center px-3 rounded-md border border-input bg-muted/30 text-sm text-muted-foreground">
                    Contract #{contracts[0].id} — {contracts[0].tarif_lunar} {contracts[0].moneda}/lună
                  </div>
                </Field>
              )}
              {!contractsLoading && contracts.length > 1 && (
                <Field label="Contract" required>
                  <select
                    value={contractId ?? ''}
                    onChange={e => setContractId(Number(e.target.value) || null)}
                    disabled={mutation.isPending}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <option value="">Selectează contract...</option>
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>
                        Contract #{c.id} — {c.tarif_lunar} {c.moneda}/lună
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </>
          )}

          {effectiveContractId && (
            <>
              <Field label="Sumă (RON)" required>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={suma}
                  onChange={e => setSuma(e.target.value)}
                  placeholder="ex: 500"
                  disabled={mutation.isPending}
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Tip plată">
                  <select
                    value={tip}
                    onChange={e => setTip(e.target.value as TipPlata)}
                    disabled={mutation.isPending}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <option value="contractuala">Contractuală</option>
                    <option value="manuala">Manuală</option>
                    <option value="penalizare">Penalizare</option>
                  </select>
                </Field>
                <Field label="Dată emitere">
                  <Input
                    type="date"
                    value={dataEmitere}
                    onChange={e => setDataEmitere(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </Field>
              </div>

              <Field label="Scadență" required>
                <Input
                  type="date"
                  value={dataScadenta}
                  onChange={e => setDataScadenta(e.target.value)}
                  disabled={mutation.isPending}
                />
              </Field>

              <Field label="Notă">
                <textarea
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  rows={2}
                  placeholder="Opțional..."
                  disabled={mutation.isPending}
                  className={cn(
                    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'resize-none disabled:opacity-50',
                  )}
                />
              </Field>
            </>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={mutation.isPending}>
            Anulează
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!canSubmit || mutation.isPending}
            loading={mutation.isPending}
          >
            {mutation.isPending ? 'Se adaugă...' : 'Adaugă plată'}
          </Button>
        </div>
      </div>
    </div>
  )
}
