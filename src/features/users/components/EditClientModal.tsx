import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['CLIENT']['Row']
type TipFirma = Database['public']['Enums']['tip_firma_enum']
type TipImpozitare = Database['public']['Enums']['tip_impozitare_enum']
type PerioadaFiscala = Database['public']['Enums']['perioada_fiscala_enum']

interface Props {
  client: Client
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

function Select({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

export function EditClientModal({ client, onClose }: Props) {
  const [denumire, setDenumire] = useState(client.denumire)
  const [email, setEmail] = useState(client.email ?? '')
  const [telefon, setTelefon] = useState(client.telefon ?? '')
  const [adresa, setAdresa] = useState(client.adresa ?? '')
  const [localitate, setLocalitate] = useState(client.localitate ?? '')
  const [judet, setJudet] = useState(client.judet ?? '')
  const [tipFirma, setTipFirma] = useState<TipFirma>(client.tip_firma)
  const [tipImpozitare, setTipImpozitare] = useState<TipImpozitare>(client.tip_impozitare)
  const [perioadaFiscala, setPerioadaFiscala] = useState<PerioadaFiscala>(client.perioada_fiscala)
  const [estePlatitorTva, setEstePlatitorTva] = useState(client.este_platitor_tva)
  const [areSalariati, setAreSalariati] = useState(client.are_salariati)
  const [banca, setBanca] = useState(client.banca ?? '')
  const [iban, setIban] = useState(client.iban ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Editează client</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{client.cif} · {client.tip_firma}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        {/* Conținut scrollabil */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Info readonly */}
          <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              ID: <span className="text-foreground font-medium">#{client.id}</span>
              <span className="mx-2 text-border">·</span>
              Înregistrat la <span className="text-foreground">{new Date(client.created_at).toLocaleDateString('ro-RO')}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              User ID: <span className="font-mono text-foreground text-[10px]">{client.user_id ?? '—'}</span>
            </p>
          </div>

          {/* Date de bază */}
          <div className="grid grid-cols-1 gap-3">
            <Field label="Denumire">
              <Input value={denumire} onChange={e => setDenumire(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="—" />
              </Field>
              <Field label="Telefon">
                <Input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="—" />
              </Field>
            </div>
          </div>

          {/* Adresă */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adresă</p>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Adresă">
                <Input value={adresa} onChange={e => setAdresa(e.target.value)} placeholder="—" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Localitate">
                  <Input value={localitate} onChange={e => setLocalitate(e.target.value)} placeholder="—" />
                </Field>
                <Field label="Județ">
                  <Input value={judet} onChange={e => setJudet(e.target.value)} placeholder="—" />
                </Field>
              </div>
            </div>
          </div>

          {/* Fiscal */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fiscal</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tip firmă">
                <Select
                  value={tipFirma}
                  onChange={v => setTipFirma(v as TipFirma)}
                  options={[
                    { value: 'SRL', label: 'SRL' },
                    { value: 'PFA', label: 'PFA' },
                    { value: 'II', label: 'II' },
                    { value: 'SA', label: 'SA' },
                    { value: 'ONG', label: 'ONG' },
                  ]}
                />
              </Field>
              <Field label="Tip impozitare">
                <Select
                  value={tipImpozitare}
                  onChange={v => setTipImpozitare(v as TipImpozitare)}
                  options={[
                    { value: 'micro', label: 'Micro-întreprindere' },
                    { value: 'profit', label: 'Impozit pe profit' },
                  ]}
                />
              </Field>
              <Field label="Perioadă fiscală">
                <Select
                  value={perioadaFiscala}
                  onChange={v => setPerioadaFiscala(v as PerioadaFiscala)}
                  options={[
                    { value: 'lunar', label: 'Lunar' },
                    { value: 'trimestrial', label: 'Trimestrial' },
                  ]}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Toggle label="Plătitor TVA" checked={estePlatitorTva} onChange={setEstePlatitorTva} />
              <Toggle label="Are salariați" checked={areSalariati} onChange={setAreSalariati} />
            </div>
          </div>

          {/* Bancar */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date bancare</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bancă">
                <Input value={banca} onChange={e => setBanca(e.target.value)} placeholder="—" />
              </Field>
              <Field label="IBAN">
                <Input value={iban} onChange={e => setIban(e.target.value)} placeholder="RO..." />
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Anulează
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Salvează modificările
          </Button>
        </div>
      </div>
    </div>
  )
}
