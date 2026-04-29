import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type ContractRow = Database['public']['Tables']['CONTRACT_SERVICII']['Row']
type Moneda = Database['public']['Enums']['moneda_enum']
type MotivIncetare = Database['public']['Enums']['motiv_incetare_enum']

interface Props {
  contract: ContractRow
  accountants: { user_id: string | null; denumire: string; id: number }[]
  clientName: string
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

const motivLabels: Record<MotivIncetare, string> = {
  expirare_naturala: 'Expirare naturală',
  reziliere_client: 'Reziliere client',
  reziliere_contabil: 'Reziliere contabil',
  neplata: 'Neplată',
  alt_motiv: 'Alt motiv',
}

export function EditContractModal({ contract, accountants, clientName, onClose }: Props) {
  const [contabilUid, setContabilUid] = useState(contract.contabil_uid ?? '')
  const [tarifLunar, setTarifLunar] = useState(String(contract.tarif_lunar))
  const [moneda, setMoneda] = useState<Moneda>(contract.moneda)
  const [dataInceput, setDataInceput] = useState(contract.data_inceput ?? '')
  const [dataSfarsit, setDataSfarsit] = useState(contract.data_sfarsit ?? '')
  const [esteActiv, setEsteActiv] = useState(contract.este_activ)
  const [motivIncetare, setMotivIncetare] = useState<MotivIncetare>(
    contract.motiv_incetare ?? 'expirare_naturala',
  )

  const accountantsWithUid = accountants.filter(a => a.user_id !== null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Editează contract #{contract.id}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{clientName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          <Field label="Contabil">
            <Select
              value={contabilUid}
              onChange={setContabilUid}
              placeholder="— fără contabil —"
              options={accountantsWithUid.map(a => ({
                value: a.user_id!,
                label: a.denumire,
              }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tarif lunar">
              <Input
                type="number"
                min="0"
                value={tarifLunar}
                onChange={e => setTarifLunar(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="Monedă">
              <Select
                value={moneda}
                onChange={v => setMoneda(v as Moneda)}
                options={[
                  { value: 'RON', label: 'RON' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'USD', label: 'USD' },
                  { value: 'GBP', label: 'GBP' },
                  { value: 'CHF', label: 'CHF' },
                ]}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Dată început">
              <Input type="date" value={dataInceput} onChange={e => setDataInceput(e.target.value)} />
            </Field>
            <Field label="Dată sfârșit">
              <Input type="date" value={dataSfarsit} onChange={e => setDataSfarsit(e.target.value)} />
            </Field>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={esteActiv}
              onChange={e => setEsteActiv(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">Contract activ</span>
          </label>

          {!esteActiv && (
            <Field label="Motiv încetare">
              <Select
                value={motivIncetare}
                onChange={v => setMotivIncetare(v as MotivIncetare)}
                options={Object.entries(motivLabels).map(([v, l]) => ({ value: v, label: l }))}
              />
            </Field>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button className="flex-1" onClick={onClose} disabled={!tarifLunar}>
            Salvează
          </Button>
        </div>
      </div>
    </div>
  )
}
