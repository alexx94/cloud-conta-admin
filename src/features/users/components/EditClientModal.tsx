import { useState } from 'react'
import { X, RefreshCw, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateClientOptions } from '@/features/users/api/client-mutations'
import { anafLookupOptions } from '@/features/users/api/anaf'
import { clientKeys } from '@/shared/api/clients/queries'
import { JUDETE } from '@/shared/constants/judete'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['CLIENT']['Row']
type TipFirma = Database['public']['Enums']['tip_firma_enum']
type TipImpozitare = Database['public']['Enums']['tip_impozitare_enum']
type PerioadaFiscala = Database['public']['Enums']['perioada_fiscala_enum']

interface Props {
  client: Client
  onClose: () => void
  onSuccess?: () => void
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Select({ value, onChange, options, disabled }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ label, checked, onChange, disabled }: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-input accent-primary disabled:cursor-not-allowed"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

const JUDET_OPTIONS = [
  { value: '', label: '— Selectează județul —' },
  ...JUDETE.map(j => ({ value: j.cod, label: `${j.cod} · ${j.denumire}` })),
]

export function EditClientModal({ client, onClose, onSuccess }: Props) {
  const [denumire, setDenumire] = useState(client.denumire)
  const [email, setEmail] = useState(client.email ?? '')
  const [telefon, setTelefon] = useState(client.telefon ?? '')
  const [adresa, setAdresa] = useState(client.adresa ?? '')
  const [localitate, setLocalitate] = useState(client.localitate ?? '')
  const [judetDenumire, setJudetDenumire] = useState(client.judet ?? '')
  const [codJudet, setCodJudet] = useState(client.cod_judet ?? '')
  const [nrRegCom, setNrRegCom] = useState(client.nr_reg_com ?? '')
  const [tipFirma, setTipFirma] = useState<TipFirma>(client.tip_firma)
  const [tipImpozitare, setTipImpozitare] = useState<TipImpozitare>(client.tip_impozitare)
  const [perioadaFiscala, setPerioadaFiscala] = useState<PerioadaFiscala>(client.perioada_fiscala)
  const [estePlatitorTva, setEstePlatitorTva] = useState(client.este_platitor_tva)
  const [areSalariati, setAreSalariati] = useState(client.are_salariati)
  const [banca, setBanca] = useState(client.banca ?? '')
  const [iban, setIban] = useState(client.iban ?? '')

  function handleJudetChange(cod: string) {
    const found = JUDETE.find(j => j.cod === cod)
    setCodJudet(cod)
    setJudetDenumire(found?.denumire ?? '')
  }

  const isDirty =
    denumire.trim() !== client.denumire.trim() ||
    email.trim() !== (client.email ?? '').trim() ||
    telefon.trim() !== (client.telefon ?? '').trim() ||
    adresa.trim() !== (client.adresa ?? '').trim() ||
    localitate.trim() !== (client.localitate ?? '').trim() ||
    codJudet !== (client.cod_judet ?? '') ||
    nrRegCom.trim() !== (client.nr_reg_com ?? '').trim() ||
    tipFirma !== client.tip_firma ||
    tipImpozitare !== client.tip_impozitare ||
    perioadaFiscala !== client.perioada_fiscala ||
    estePlatitorTva !== client.este_platitor_tva ||
    areSalariati !== client.are_salariati ||
    banca.trim() !== (client.banca ?? '').trim() ||
    iban.trim() !== (client.iban ?? '').trim()

  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    ...updateClientOptions(client.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      toast.success('Client actualizat cu succes.')
      onSuccess?.()
      onClose()
    },
  })

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
        setJudetDenumire(data.judet)
        setCodJudet('')
      }
      toast.success('Date preluate de la ANAF.')
    },
  })

  const isAnyPending = saveMutation.isPending || anafMutation.isPending

  function handleClose() {
    if (saveMutation.isPending) return
    onClose()
  }

  function handleSave() {
    saveMutation.mutate({
      modified_at: new Date().toISOString(),
      denumire: denumire.trim(),
      email: email.trim() || null,
      telefon: telefon.trim() || null,
      adresa: adresa.trim() || null,
      localitate: localitate.trim() || null,
      judet: judetDenumire || null,
      cod_judet: codJudet || null,
      nr_reg_com: nrRegCom.trim() || null,
      tip_firma: tipFirma,
      tip_impozitare: tipImpozitare,
      perioada_fiscala: perioadaFiscala,
      este_platitor_tva: estePlatitorTva,
      are_salariati: areSalariati,
      banca: banca.trim() || null,
      iban: iban.trim() || null,
    })
  }

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
            <h2 className="text-sm font-semibold text-foreground">Editează client</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{client.cif} · {client.tip_firma}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isAnyPending}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Conținut scrollabil */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Info readonly */}
          <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                ID: <span className="text-foreground font-medium">#{client.id}</span>
                <span className="mx-2 text-border">·</span>
                Înregistrat la <span className="text-foreground">{new Date(client.created_at).toLocaleDateString('ro-RO')}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                User ID: <span className="font-mono text-foreground text-[10px]">{client.user_id ?? '—'}</span>
              </p>
            </div>
            <button
              onClick={() => anafMutation.mutate(client.cif)}
              disabled={isAnyPending}
              className="shrink-0 flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {anafMutation.isPending
                ? <Loader2 className="size-3 animate-spin" />
                : <RefreshCw className="size-3" />
              }
              Preia ANAF
            </button>
          </div>

          {/* Date de bază */}
          <div className="grid grid-cols-1 gap-3">
            <Field label="Denumire" required>
              <Input
                value={denumire}
                onChange={e => setDenumire(e.target.value)}
                disabled={isAnyPending}
                autoFocus
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="—"
                  disabled={isAnyPending}
                />
              </Field>
              <Field label="Telefon">
                <Input
                  value={telefon}
                  onChange={e => setTelefon(e.target.value)}
                  placeholder="—"
                  disabled={isAnyPending}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nr. Reg. Com.">
                <Input
                  value={nrRegCom}
                  onChange={e => setNrRegCom(e.target.value)}
                  placeholder="J40/1234/2020"
                  disabled={isAnyPending}
                />
              </Field>
            </div>
          </div>

          {/* Adresă */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adresă</p>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Adresă">
                <Input
                  value={adresa}
                  onChange={e => setAdresa(e.target.value)}
                  placeholder="—"
                  disabled={isAnyPending}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Localitate">
                  <Input
                    value={localitate}
                    onChange={e => setLocalitate(e.target.value)}
                    placeholder="—"
                    disabled={isAnyPending}
                  />
                </Field>
                <Field label="Județ">
                  <Select
                    value={codJudet}
                    onChange={handleJudetChange}
                    options={JUDET_OPTIONS}
                    disabled={isAnyPending}
                  />
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
                  disabled={isAnyPending}
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
                  disabled={isAnyPending}
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
                  disabled={isAnyPending}
                  options={[
                    { value: 'lunar', label: 'Lunar' },
                    { value: 'trimestrial', label: 'Trimestrial' },
                  ]}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Toggle label="Plătitor TVA" checked={estePlatitorTva} onChange={setEstePlatitorTva} disabled={isAnyPending} />
              <Toggle label="Are salariați" checked={areSalariati} onChange={setAreSalariati} disabled={isAnyPending} />
            </div>
          </div>

          {/* Bancar */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date bancare</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bancă">
                <Input
                  value={banca}
                  onChange={e => setBanca(e.target.value)}
                  placeholder="—"
                  disabled={isAnyPending}
                />
              </Field>
              <Field label="IBAN">
                <Input
                  value={iban}
                  onChange={e => setIban(e.target.value)}
                  placeholder="RO..."
                  disabled={isAnyPending}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={isAnyPending}
          >
            Anulează
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!isDirty || isAnyPending}
            loading={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Se salvează...' : 'Salvează modificările'}
          </Button>
        </div>
      </div>
    </div>
  )
}
