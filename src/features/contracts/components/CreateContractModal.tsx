import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type Moneda = Database['public']['Enums']['moneda_enum']

interface Props {
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

interface PickerItem {
  id: string
  label: string
  sub?: string
}

const MOCK_CLIENT_ITEMS: PickerItem[] = [
  { id: 'uid-client-1', label: 'Alfa SRL', sub: 'RO12345678' },
  { id: 'uid-client-2', label: 'Beta PFA', sub: 'RO87654321' },
]

const MOCK_CONTABIL_ITEMS: PickerItem[] = [
  { id: 'uid-acc-1', label: 'Ion Popescu Contabilitate' },
  { id: 'uid-acc-2', label: 'Maria Ionescu Expert' },
]

function SearchPicker({
  label,
  placeholder,
  items,
  selectedId,
  selectedLabel,
  onSelect,
  onClear,
  onSearchChange,
  search,
  minChars = 2,
}: {
  label: string
  placeholder: string
  items: PickerItem[]
  selectedId: string | null
  selectedLabel?: string
  onSelect: (id: string, item: PickerItem) => void
  onClear: () => void
  onSearchChange: (v: string) => void
  search: string
  minChars?: number
}) {
  const [open, setOpen] = useState(false)
  const showDropdown = open && search.trim().length >= minChars

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    (item.sub?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  return (
    <Field label={label}>
      {selectedId ? (
        <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-background text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <Check className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{selectedLabel}</span>
          </div>
          <button onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2">
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => { onSearchChange(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {showDropdown && (
            <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">Niciun rezultat</p>
              ) : (
                filtered.map(item => (
                  <button
                    key={item.id}
                    onMouseDown={() => { onSelect(item.id, item); setOpen(false) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.sub && <span className="text-xs text-muted-foreground shrink-0">{item.sub}</span>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </Field>
  )
}

export function CreateContractModal({ onClose }: Props) {
  const [clientUid, setClientUid] = useState<string | null>(null)
  const [clientLabel, setClientLabel] = useState('')
  const [clientSearch, setClientSearch] = useState('')

  const [contabilUid, setContabilUid] = useState<string | null>(null)
  const [contabilLabel, setContabilLabel] = useState('')
  const [contabilSearch, setContabilSearch] = useState('')

  const [tarifLunar, setTarifLunar] = useState('')
  const [moneda, setMoneda] = useState<Moneda>('RON')
  const [dataInceput, setDataInceput] = useState(() => new Date().toISOString().split('T')[0])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Contract nou</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Asociază un client cu un contabil</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <SearchPicker
            label="Client *"
            placeholder="Minim 2 caractere..."
            items={MOCK_CLIENT_ITEMS}
            selectedId={clientUid}
            selectedLabel={clientLabel}
            search={clientSearch}
            onSearchChange={setClientSearch}
            onSelect={(id, item) => { setClientUid(id); setClientLabel(item.label) }}
            onClear={() => { setClientUid(null); setClientLabel(''); setClientSearch('') }}
          />

          <SearchPicker
            label="Contabil"
            placeholder="Minim 2 caractere..."
            items={MOCK_CONTABIL_ITEMS}
            selectedId={contabilUid}
            selectedLabel={contabilLabel}
            search={contabilSearch}
            onSearchChange={setContabilSearch}
            onSelect={(id, item) => { setContabilUid(id); setContabilLabel(item.label) }}
            onClear={() => { setContabilUid(null); setContabilLabel(''); setContabilSearch('') }}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarif lunar *">
              <Input
                type="number"
                min="0"
                value={tarifLunar}
                onChange={e => setTarifLunar(e.target.value)}
                placeholder="ex: 500"
              />
            </Field>
            <Field label="Monedă">
              <select
                value={moneda}
                onChange={e => setMoneda(e.target.value as Moneda)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {(['RON', 'EUR', 'USD', 'GBP', 'CHF'] as Moneda[]).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Dată început *">
            <Input type="date" value={dataInceput} onChange={e => setDataInceput(e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button
            className="flex-1"
            onClick={onClose}
            disabled={!clientUid || !tarifLunar}
          >
            Creează contract
          </Button>
        </div>
      </div>
    </div>
  )
}
