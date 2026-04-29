import { useState } from 'react'
import { X, Search, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type TipFirma = Database['public']['Enums']['tip_firma_enum']
type TipImpozitare = Database['public']['Enums']['tip_impozitare_enum']
type PerioadaFiscala = Database['public']['Enums']['perioada_fiscala_enum']
type Moneda = Database['public']['Enums']['moneda_enum']

interface Props {
  onClose: () => void
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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

const MOCK_ACCOUNTANTS = [
  { user_id: 'uid-acc-1', denumire: 'Ion Popescu Contabilitate' },
  { user_id: 'uid-acc-2', denumire: 'Maria Ionescu Expert' },
]

type Step = 'client' | 'contract' | 'credentials'
const steps: Step[] = ['client', 'contract', 'credentials']

export function CreateClientModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('client')

  const [cif, setCif] = useState('')
  const [denumire, setDenumire] = useState('')
  const [tipFirma, setTipFirma] = useState<TipFirma>('SRL')
  const [tipImpozitare, setTipImpozitare] = useState<TipImpozitare>('micro')
  const [perioadaFiscala, setPerioadaFiscala] = useState<PerioadaFiscala>('lunar')
  const [estePlatitorTva, setEstePlatitorTva] = useState(false)
  const [areSalariati, setAreSalariati] = useState(false)

  const [telefon, setTelefon] = useState('')
  const [adresa, setAdresa] = useState('')
  const [localitate, setLocalitate] = useState('')
  const [judet, setJudet] = useState('')
  const [codJudet, setCodJudet] = useState('')
  const [nrRegCom, setNrRegCom] = useState('')

  const [contabilUid, setContabilUid] = useState('')
  const [tarifLunar, setTarifLunar] = useState('')
  const [moneda, setMoneda] = useState<Moneda>('RON')
  const [dataInceput, setDataInceput] = useState(() => new Date().toISOString().split('T')[0])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [anafLoading, setAnafLoading] = useState(false)
  const [anafLoaded, setAnafLoaded] = useState(false)

  async function handleAnafLookup() {
    if (!cif.trim()) return
    setAnafLoading(true)
    setAnafLoaded(false)
    await new Promise(r => setTimeout(r, 400))
    setAnafLoading(false)
  }

  const stepTitles: Record<Step, string> = {
    client: 'Date firmă',
    contract: 'Contract servicii',
    credentials: 'Cont utilizator',
  }

  const canGoNext =
    (step === 'client' && !!cif.trim() && !!denumire.trim()) ||
    (step === 'contract' && !!tarifLunar)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Client nou</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{stepTitles[step]}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex px-5 pt-3 gap-1.5 shrink-0">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                steps.indexOf(step) >= i ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>

        {/* Conținut */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* ── Step 1: Date firmă ── */}
          {step === 'client' && (
            <>
              <Field label="CIF *">
                <div className="flex gap-2">
                  <Input
                    value={cif}
                    onChange={e => { setCif(e.target.value); setAnafLoaded(false) }}
                    placeholder="ex: RO12345678"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleAnafLookup()}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAnafLookup}
                    disabled={anafLoading || !cif.trim()}
                    className="gap-1.5 shrink-0"
                  >
                    {anafLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : anafLoaded ? (
                      <CheckCircle2 className="size-3.5 text-green-500" />
                    ) : (
                      <Search className="size-3.5" />
                    )}
                    Preia ANAF
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Denumire *">
                  <Input value={denumire} onChange={e => setDenumire(e.target.value)} placeholder="Numele firmei" />
                </Field>
                <Field label="Nr. Reg. Com.">
                  <Input value={nrRegCom} onChange={e => setNrRegCom(e.target.value)} placeholder="J40/1234/2020" />
                </Field>
              </div>

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
              </div>

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

              <div className="flex flex-col gap-2">
                <Toggle label="Plătitor TVA" checked={estePlatitorTva} onChange={setEstePlatitorTva} />
                <Toggle label="Are salariați" checked={areSalariati} onChange={setAreSalariati} />
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">Contact & Adresă</p>

              <Field label="Telefon">
                <Input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="0721 000 000" />
              </Field>

              <Field label="Adresă">
                <Input value={adresa} onChange={e => setAdresa(e.target.value)} placeholder="Str. Exemplu nr. 1" />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Localitate">
                  <Input value={localitate} onChange={e => setLocalitate(e.target.value)} placeholder="București" />
                </Field>
                <Field label="Județ">
                  <Input value={judet} onChange={e => setJudet(e.target.value)} placeholder="Ilfov" />
                </Field>
                <Field label="Cod județ">
                  <Input value={codJudet} onChange={e => setCodJudet(e.target.value)} placeholder="IF" />
                </Field>
              </div>
            </>
          )}

          {/* ── Step 2: Contract ── */}
          {step === 'contract' && (
            <>
              <Field label="Contabil">
                <Select
                  value={contabilUid}
                  onChange={setContabilUid}
                  placeholder="— fără contabil —"
                  options={MOCK_ACCOUNTANTS.map(a => ({
                    value: a.user_id,
                    label: a.denumire,
                  }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tarif lunar *">
                  <Input
                    type="number"
                    min="0"
                    value={tarifLunar}
                    onChange={e => setTarifLunar(e.target.value)}
                    placeholder="ex: 500"
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
                    ]}
                  />
                </Field>
              </div>
              <Field
                label="Dată început *"
                hint="Dacă data e azi sau în trecut, contractul devine activ imediat și se generează prima plată."
              >
                <Input type="date" value={dataInceput} onChange={e => setDataInceput(e.target.value)} />
              </Field>
            </>
          )}

          {/* ── Step 3: Credențiale ── */}
          {step === 'credentials' && (
            <>
              <Field label="Email *">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@exemplu.ro"
                  autoFocus
                />
              </Field>
              <Field label="Parolă *">
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="min. 6 caractere"
                />
              </Field>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          {step !== 'client' ? (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(step === 'credentials' ? 'contract' : 'client')}
            >
              Înapoi
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Anulează
            </Button>
          )}

          {step !== 'credentials' ? (
            <Button
              className="flex-1"
              onClick={() => setStep(step === 'client' ? 'contract' : 'credentials')}
              disabled={!canGoNext}
            >
              Continuă
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={onClose}
              disabled={!email.trim() || !password.trim()}
            >
              Creează client
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
