import { useState } from 'react'
import { ArrowRightLeft, Pencil, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type ContractRowType = Database['public']['Tables']['CONTRACT_SERVICII']['Row']
type MotivIncetare = Database['public']['Enums']['motiv_incetare_enum']

const motivLabels: Record<MotivIncetare, string> = {
  expirare_naturala: 'Expirare naturală',
  reziliere_client: 'Reziliere client',
  reziliere_contabil: 'Reziliere contabil',
  neplata: 'Neplată',
  alt_motiv: 'Alt motiv',
}

const motivOptions = Object.entries(motivLabels) as [MotivIncetare, string][]

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface Props {
  contract: ContractRowType
}

export function ContractRow({ contract }: Props) {
  const [editingAccountant, setEditingAccountant] = useState(false)
  const [editingTarif, setEditingTarif] = useState(false)
  const [showTerminare, setShowTerminare] = useState(false)
  const [newContabilUid, setNewContabilUid] = useState('')
  const [tarif, setTarif] = useState(String(contract.tarif_lunar))
  const [motivIncetare, setMotivIncetare] = useState<MotivIncetare>('expirare_naturala')

  return (
    <div className="group px-4 py-4 hover:bg-muted/40 transition-colors border-b border-border last:border-0 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-start">
            {/* Client */}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Client</p>
              <p className="text-sm font-medium text-foreground truncate font-mono text-[11px]">
                {contract.client_uid ?? '—'}
              </p>
            </div>

            {/* Contabil */}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Contabil</p>
              {editingAccountant ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newContabilUid}
                    onChange={e => setNewContabilUid(e.target.value)}
                    placeholder="UUID contabil..."
                    className="h-8 w-48 rounded-md border border-input bg-background px-2 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button size="sm" onClick={() => setEditingAccountant(false)}>
                    Salvează
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingAccountant(false)}>
                    Anulează
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate font-mono text-[11px]">
                    {contract.contabil_uid ?? '—'}
                  </p>
                  {contract.este_activ && (
                    <button
                      onClick={() => { setNewContabilUid(contract.contabil_uid ?? ''); setEditingAccountant(true) }}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-0.5 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                      title="Schimbă contabilul"
                    >
                      <ArrowRightLeft className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tarif */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Tarif lunar</p>
              {editingTarif ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    value={tarif}
                    onChange={e => setTarif(e.target.value)}
                    className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-xs text-muted-foreground">{contract.moneda}</span>
                  <Button size="sm" onClick={() => setEditingTarif(false)}>
                    Salvează
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTarif(false)}>
                    Anulează
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <p className="text-sm text-foreground">
                    {contract.tarif_lunar} {contract.moneda}
                  </p>
                  {contract.este_activ && (
                    <button
                      onClick={() => setEditingTarif(true)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-0.5 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                      title="Modifică tariful"
                    >
                      <Pencil className="size-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Perioadă */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Perioadă</p>
              <p className="text-sm text-foreground">
                {formatDate(contract.data_inceput)}
                {' — '}
                {contract.este_activ ? (
                  <span className="text-muted-foreground">prezent</span>
                ) : (
                  formatDate(contract.data_sfarsit)
                )}
              </p>
              {!contract.este_activ && contract.motiv_incetare && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {motivLabels[contract.motiv_incetare]}
                </p>
              )}
            </div>

            {/* Status + acțiuni */}
            <div className="flex flex-col gap-2 items-start">
              <Badge variant={contract.este_activ ? 'success' : 'outline'}>
                {contract.este_activ ? 'Activ' : 'Inactiv'}
              </Badge>

              {contract.este_activ && !showTerminare && (
                <button
                  onClick={() => setShowTerminare(true)}
                  className="text-xs text-destructive hover:underline text-left transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                >
                  Termină contractul
                </button>
              )}
            </div>
          </div>

          {showTerminare && (
            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-destructive">Termină contractul</p>
                <button
                  onClick={() => setShowTerminare(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Motiv încetare</label>
                <select
                  value={motivIncetare}
                  onChange={e => setMotivIncetare(e.target.value as MotivIncetare)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {motivOptions.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-muted-foreground">
                Data de încheiere va fi setată la ziua de azi. Această acțiune nu poate fi anulată.
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTerminare(false)}>
                  Anulează
                </Button>
                <Button
                  size="sm"
                  className={cn('bg-destructive text-destructive-foreground hover:bg-destructive/90')}
                  onClick={() => setShowTerminare(false)}
                >
                  Confirmă terminarea
                </Button>
              </div>
            </div>
          )}
    </div>
  )
}
