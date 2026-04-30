import { useState } from 'react'
import { X, Search, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { JUDETE } from '@/shared/constants/judete'
import { anafLookupOptions } from '@/features/users/api/anaf'
import { createClientOptions } from '@/features/users/api/client-mutations'
import { clientKeys } from '@/shared/api/clients/queries'
import type { Database } from '@/types/database'

type TipFirma = Database['public']['Enums']['tip_firma_enum']
type TipImpozitare = Database['public']['Enums']['tip_impozitare_enum']
type PerioadaFiscala = Database['public']['Enums']['perioada_fiscala_enum']

interface Props {
  onClose: () => void
}

const JUDET_OPTIONS = [
  { value: '', label: '— Selectează județul —' },
  ...JUDETE.map(j => ({ value: j.cod, label: `${j.cod} · ${j.denumire}` })),
]

function Field({ label, required, children, hint, error }: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error
        ? <p className="text-xs text-red-500">{error}</p>
        : hint && <p className="text-xs text-muted-foreground">{hint}</p>
      }
    </div>
  )
}

function SelectInput({ value, onChange, options, placeholder, disabled }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
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

type Step = 'client' | 'credentials'
const STEPS: Step[] = ['client', 'credentials']

export function CreateClientModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>('client')

  // Step 1 — Date firmă
  const [cif, setCif] = useState('')
  const [denumire, setDenumire] = useState('')
  const [tipFirma, setTipFirma] = useState<TipFirma | ''>('')
  const [tipImpozitare, setTipImpozitare] = useState<TipImpozitare | ''>('')
  const [perioadaFiscala, setPerioadaFiscala] = useState<PerioadaFiscala>('lunar')
  const [estePlatitorTva, setEstePlatitorTva] = useState(false)
  const [areSalariati, setAreSalariati] = useState(false)
  const [telefon, setTelefon] = useState('')
  const [adresa, setAdresa] = useState('')
  const [localitate, setLocalitate] = useState('')
  const [judet, setJudet] = useState('')
  const [codJudet, setCodJudet] = useState('')
  const [nrRegCom, setNrRegCom] = useState('')

  // Step 2 — Credențiale
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const emailError = emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? 'Introdu o adresă de email validă.'
    : undefined
  const passwordError = passwordTouched && password.length < 8
    ? 'Parola trebuie să aibă cel puțin 8 caractere.'
    : undefined
  const credentialsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length >= 8

  function handleJudetChange(cod: string) {
    const found = JUDETE.find(j => j.cod === cod)
    setCodJudet(cod)
    setJudet(found?.denumire ?? '')
  }

  // TODO - Client modal trebuie sa aiba mutations si queries puse ca hooks, nu asa la gramada

  const queryClient = useQueryClient()

  const anafMutation = useMutation({
    ...anafLookupOptions,
    onSuccess: (data) => {
      setDenumire(data.denumire)
      setAdresa(data.adresa)
      setLocalitate(data.localitate)
      setTelefon(data.telefon ?? '')
      setEstePlatitorTva(data.este_platitor_tva)
      setNrRegCom(data.nr_reg_com ?? '')
      if (data.cod_judet) {
        handleJudetChange(data.cod_judet)
      } else {
        setJudet(data.judet)
        setCodJudet('')
      }
    },
  })

  const createMutation = useMutation({
    ...createClientOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      toast.success('Client creat cu succes.')
      onClose()
    },
  })

  function handleClose() {
    if (createMutation.isPending) return
    onClose()
  }

  function handleCreate() {
    if (!tipFirma || !tipImpozitare) return
    createMutation.mutate({
      cif: cif.trim(),
      denumire: denumire.trim(),
      tipFirma,
      tipImpozitare,
      perioadaFiscala,
      estePlatitorTva,
      areSalariati,
      telefon: telefon.trim() || null,
      adresa: adresa.trim() || null,
      localitate: localitate.trim() || null,
      judet: judet || null,
      codJudet: codJudet || null,
      nrRegCom: nrRegCom.trim() || null,
      email: email.trim(),
      password,
    })
  }

  const stepTitles: Record<Step, string> = {
    client: 'Date firmă',
    credentials: 'Cont utilizator',
  }

  const canGoNext = step === 'client' && !!cif.trim() && !!denumire.trim() && !!tipFirma && !!tipImpozitare

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      onKeyDown={e => { if (e.key === 'Escape') handleClose() }}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Client nou</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{stepTitles[step]}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex px-5 pt-3 gap-1.5 shrink-0">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                STEPS.indexOf(step) >= i ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>

        {/* Conținut */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">

          {/* ── Step 1: Date firmă ── */}
          {step === 'client' && (
            <>
              <Field label="CIF" required>
                <div className="flex gap-2">
                  <Input
                    value={cif}
                    onChange={e => { setCif(e.target.value); anafMutation.reset() }}
                    placeholder="ex: RO12345678"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && !anafMutation.isPending && cif.trim() && anafMutation.mutate(cif.trim())}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => anafMutation.mutate(cif.trim())}
                    disabled={anafMutation.isPending || !cif.trim()}
                    className="gap-1.5 shrink-0"
                  >
                    {anafMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : anafMutation.isSuccess ? (
                      <CheckCircle2 className="size-3.5 text-green-500" />
                    ) : (
                      <Search className="size-3.5" />
                    )}
                    Preia ANAF
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Denumire" required>
                  <Input value={denumire} onChange={e => setDenumire(e.target.value)} placeholder="Numele firmei" />
                </Field>
                <Field label="Nr. Reg. Com.">
                  <Input value={nrRegCom} onChange={e => setNrRegCom(e.target.value)} placeholder="J40/1234/2020" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Tip firmă" required>
                  <SelectInput
                    value={tipFirma}
                    onChange={v => setTipFirma(v as TipFirma)}
                    placeholder="— Selectează —"
                    options={[
                      { value: 'SRL', label: 'SRL' },
                      { value: 'PFA', label: 'PFA' },
                      { value: 'II', label: 'II' },
                      { value: 'SA', label: 'SA' },
                      { value: 'ONG', label: 'ONG' },
                    ]}
                  />
                </Field>
                <Field label="Tip impozitare" required>
                  <SelectInput
                    value={tipImpozitare}
                    onChange={v => setTipImpozitare(v as TipImpozitare)}
                    placeholder="— Selectează —"
                    options={[
                      { value: 'micro', label: 'Micro-întreprindere' },
                      { value: 'profit', label: 'Impozit pe profit' },
                    ]}
                  />
                </Field>
              </div>

              <Field label="Perioadă fiscală">
                <SelectInput
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

              <div className="grid grid-cols-2 gap-3">
                <Field label="Localitate">
                  <Input value={localitate} onChange={e => setLocalitate(e.target.value)} placeholder="București" />
                </Field>
                <Field label="Județ">
                  <SelectInput
                    value={codJudet}
                    onChange={handleJudetChange}
                    options={JUDET_OPTIONS}
                  />
                </Field>
              </div>
            </>
          )}

          {/* ── Step 2: Credențiale ── */}
          {step === 'credentials' && (
            <>
              <Field label="Email" required error={emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="client@exemplu.ro"
                  autoFocus
                  disabled={createMutation.isPending}
                  className={emailError ? 'border-red-500 focus-visible:ring-red-500/30' : ''}
                />
              </Field>
              <Field label="Parolă" required error={passwordError}>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="min. 8 caractere"
                    disabled={createMutation.isPending}
                    className={`pr-9 ${passwordError ? 'border-red-500 focus-visible:ring-red-500/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          {step !== 'client' ? (
            <Button variant="outline" className="flex-1" onClick={() => setStep('client')} disabled={createMutation.isPending}>
              Înapoi
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Anulează
            </Button>
          )}

          {step !== 'credentials' ? (
            <Button
              className="flex-1"
              onClick={() => setStep('credentials')}
              disabled={!canGoNext}
            >
              Continuă
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={handleCreate}
              disabled={!credentialsValid || createMutation.isPending}
              loading={createMutation.isPending}
            >
              {createMutation.isPending ? 'Se creează...' : 'Creează client'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
