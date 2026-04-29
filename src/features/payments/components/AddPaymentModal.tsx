import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  onClose: () => void
}

type Step = 'select-client' | 'fill-payment'

const MOCK_CLIENTS_WITH_CONTRACTS = [
  { id: 1, user_id: 'uid-client-1', denumire: 'Alfa SRL', cif: 'RO12345678', contractId: 1 },
  { id: 2, user_id: 'uid-client-2', denumire: 'Beta PFA', cif: 'RO87654321', contractId: 2 },
]

export function AddPaymentModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('select-client')
  const [clientSearch, setClientSearch] = useState('')
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null)
  const [selectedClientName, setSelectedClientName] = useState('')
  const [suma, setSuma] = useState('')
  const [dataEmitere, setDataEmitere] = useState(() => new Date().toISOString().split('T')[0])
  const [dataScadenta, setDataScadenta] = useState('')
  const [nota, setNota] = useState('')

  const filtered = clientSearch.trim()
    ? MOCK_CLIENTS_WITH_CONTRACTS.filter(c =>
        c.denumire.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.cif.toLowerCase().includes(clientSearch.toLowerCase())
      )
    : MOCK_CLIENTS_WITH_CONTRACTS

  function handleSelectClient(contractId: number, clientName: string) {
    setSelectedContractId(contractId)
    setSelectedClientName(clientName)
    setStep('fill-payment')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Adaugă plată manuală</h2>
            {step === 'fill-payment' && (
              <p className="text-xs text-muted-foreground mt-0.5">{selectedClientName}</p>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Step 1 — selectare client */}
        {step === 'select-client' && (
          <div className="p-5 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                placeholder="Caută client după denumire sau CIF..."
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-border rounded-md border border-border">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                  Niciun client găsit.
                </p>
              ) : (
                filtered.map(client => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client.contractId, client.denumire)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{client.denumire}</p>
                      <p className="text-xs text-muted-foreground">{client.cif}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      Contract #{client.contractId}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2 — detalii plată */}
        {step === 'fill-payment' && (
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sumă (RON)</label>
              <Input
                autoFocus
                type="number"
                min="0"
                step="0.01"
                value={suma}
                onChange={e => setSuma(e.target.value)}
                placeholder="ex: 500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Dată emitere</label>
                <Input
                  type="date"
                  value={dataEmitere}
                  onChange={e => setDataEmitere(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Scadență</label>
                <Input
                  type="date"
                  value={dataScadenta}
                  onChange={e => setDataScadenta(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Notă <span className="font-normal">(opțional)</span>
              </label>
              <textarea
                value={nota}
                onChange={e => setNota(e.target.value)}
                rows={2}
                placeholder="ex: Servicii suplimentare septembrie..."
                className={cn(
                  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'resize-none',
                )}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('select-client')}
              >
                Înapoi
              </Button>
              <Button
                className="flex-1"
                onClick={onClose}
                disabled={!suma || !dataScadenta}
              >
                Adaugă plată
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
