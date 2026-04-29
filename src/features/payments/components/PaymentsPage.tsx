import { useState } from 'react'
import { CheckCircle, TrendingUp, AlertTriangle, Plus, Building2, FileText, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { AddPaymentModal } from './AddPaymentModal'
import { EditPaymentModal, type PaymentRow } from './EditPaymentModal'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type PaymentStatus = Database['public']['Enums']['status_plata_enum']
type TipPlata = Database['public']['Enums']['tip_plata_enum']
type PaymentFilter = 'all' | PaymentStatus
type TipFilter = 'all' | TipPlata

const statusConfig: Record<PaymentStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'outline' }> = {
  platit: { label: 'Plătit', variant: 'success' },
  in_lucru: { label: 'În lucru', variant: 'warning' },
  depasit: { label: 'Depășit', variant: 'destructive' },
  anulat: { label: 'Anulat', variant: 'outline' },
}

const tipConfig: Record<TipPlata, { label: string; variant: 'default' | 'outline' }> = {
  contractuala: { label: 'Contractuală', variant: 'outline' },
  manuala: { label: 'Manuală', variant: 'default' },
  penalizare: { label: 'Penalizare', variant: 'default' },
}

const statusFilters: { id: PaymentFilter; label: string }[] = [
  { id: 'all', label: 'Toate' },
  { id: 'in_lucru', label: 'În lucru' },
  { id: 'depasit', label: 'Depășite' },
  { id: 'platit', label: 'Plătite' },
  { id: 'anulat', label: 'Anulate' },
]

const tipFilters: { id: TipFilter; label: string }[] = [
  { id: 'all', label: 'Toate tipurile' },
  { id: 'contractuala', label: 'Contractuale' },
  { id: 'manuala', label: 'Manuale' },
  { id: 'penalizare', label: 'Penalizări' },
]

function formatRON(amount: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const MOCK_PAYMENTS: PaymentRow[] = [
  {
    id: 1, suma: 500, status: 'platit', tip: 'contractuala',
    data_emitere: '2024-04-01', data_scadenta: '2024-04-15', data_plata: '2024-04-10',
    metoda: 'transfer_bancar', nota: null, contract_servicii: 1,
    client_denumire: 'Alfa SRL', client_cif: 'RO12345678',
  },
  {
    id: 2, suma: 500, status: 'in_lucru', tip: 'contractuala',
    data_emitere: '2024-05-01', data_scadenta: '2024-05-15', data_plata: null,
    metoda: null, nota: 'Așteptăm confirmarea plății.', contract_servicii: 1,
    client_denumire: 'Alfa SRL', client_cif: 'RO12345678',
  },
  {
    id: 3, suma: 300, status: 'depasit', tip: 'contractuala',
    data_emitere: '2024-04-01', data_scadenta: '2024-04-30', data_plata: null,
    metoda: null, nota: null, contract_servicii: 2,
    client_denumire: 'Beta PFA', client_cif: 'RO87654321',
  },
  {
    id: 4, suma: 200, status: 'platit', tip: 'manuala',
    data_emitere: '2024-03-20', data_scadenta: '2024-03-31', data_plata: '2024-03-28',
    metoda: 'cash', nota: 'Serviciu suplimentar contabilitate primară.', contract_servicii: 1,
    client_denumire: 'Alfa SRL', client_cif: 'RO12345678',
  },
  {
    id: 5, suma: 50, status: 'anulat', tip: 'penalizare',
    data_emitere: '2024-02-01', data_scadenta: '2024-02-28', data_plata: null,
    metoda: null, nota: null, contract_servicii: 2,
    client_denumire: 'Beta PFA', client_cif: 'RO87654321',
  },
]

const MOCK_SUMMARY = {
  totalIncasat: 700,
  totalNeincasat: 500,
  totalDepasit: 300,
}

export function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentFilter>('all')
  const [tipFilter, setTipFilter] = useState<TipFilter>('all')
  const [clientSearch, setClientSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentRow | null>(null)

  const allPayments = MOCK_PAYMENTS.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (tipFilter !== 'all' && p.tip !== tipFilter) return false
    if (clientSearch.trim()) {
      const lower = clientSearch.toLowerCase()
      if (
        !p.client_denumire?.toLowerCase().includes(lower) &&
        !p.client_cif?.toLowerCase().includes(lower)
      ) return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plăți"
        description="Situația financiară a tuturor contractelor."
        action={
          <Button onClick={() => setShowAddModal(true)} className="gap-1.5">
            <Plus className="size-4" />
            Plată manuală
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total încasat"
          value={formatRON(MOCK_SUMMARY.totalIncasat)}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="De încasat"
          value={formatRON(MOCK_SUMMARY.totalNeincasat)}
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          label="Scadență depășită"
          value={formatRON(MOCK_SUMMARY.totalDepasit)}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Filtre */}
        <div className="flex flex-col gap-3 px-4 py-3 border-b border-border bg-muted/30">
          {/* Rândul 1: filtre status */}
          <div className="flex flex-wrap items-center gap-1">
            {statusFilters.map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  statusFilter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Rândul 2: filtre tip + căutare client */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-wrap gap-1">
              {tipFilters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setTipFilter(f.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    tipFilter === f.id
                      ? 'bg-secondary text-secondary-foreground border border-border'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto w-full sm:w-56">
              <SearchInput
                value={clientSearch}
                onChange={setClientSearch}
                placeholder="Caută client..."
              />
            </div>
          </div>
        </div>

        {/* Tabel */}
        {allPayments.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            Nicio plată pentru filtrele selectate.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header desktop */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>Client</span>
              <span>Contract</span>
              <span>Sumă</span>
              <span>Scadență</span>
              <span>Tip</span>
              <span>Status</span>
              <span className="w-16" />
            </div>

            {allPayments.map(payment => {
              const status = statusConfig[payment.status]
              const tip = tipConfig[payment.tip]
              const contractId = payment.contract_servicii
              const isExpanded = expandedId === payment.id
              const hasNota = !!payment.nota

              return (
                <div key={payment.id} className={cn(
                  'group border-b border-border last:border-0 transition-colors',
                  isExpanded && 'bg-muted/20',
                )}>
                  {/* Rândul principal */}
                  <div
                    onClick={() => hasNota && setExpandedId(isExpanded ? null : payment.id)}
                    className={cn(
                      'grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-2 lg:gap-4 px-4 py-3.5 items-start lg:items-center transition-colors',
                      hasNota ? 'cursor-pointer hover:bg-muted/30' : 'hover:bg-muted/40',
                    )}
                  >
                    {/* Client */}
                    <div className="flex items-start gap-2 min-w-0">
                      <Building2 className="size-3.5 text-muted-foreground shrink-0 mt-0.5 lg:mt-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {payment.client_denumire ?? <span className="text-muted-foreground italic">Client necunoscut</span>}
                        </p>
                        {payment.client_cif && (
                          <p className="text-xs text-muted-foreground">{payment.client_cif}</p>
                        )}
                      </div>
                    </div>

                    {/* Contract */}
                    <div className="flex items-center gap-1.5">
                      <span className="lg:hidden text-xs text-muted-foreground w-20 shrink-0">Contract</span>
                      <div className="flex items-center gap-1">
                        <FileText className="size-3 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">#{contractId ?? '—'}</span>
                      </div>
                    </div>

                    {/* Sumă */}
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden text-xs text-muted-foreground w-20 shrink-0">Sumă</span>
                      <span className="text-sm font-medium text-foreground">{formatRON(payment.suma)}</span>
                    </div>

                    {/* Scadență */}
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden text-xs text-muted-foreground w-20 shrink-0">Scadență</span>
                      <span className={cn(
                        'text-sm',
                        payment.status === 'depasit' ? 'text-destructive font-medium' : 'text-muted-foreground',
                      )}>
                        {formatDate(payment.data_scadenta)}
                      </span>
                    </div>

                    {/* Tip */}
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden text-xs text-muted-foreground w-20 shrink-0">Tip</span>
                      <Badge variant={tip.variant}>{tip.label}</Badge>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className="lg:hidden text-xs text-muted-foreground w-20 shrink-0">Status</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {hasNota && (
                          <ChevronDown className={cn(
                            'size-3.5 text-muted-foreground transition-transform',
                            isExpanded && 'rotate-180',
                          )} />
                        )}
                      </div>
                    </div>

                    {/* Acțiuni */}
                    <div
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1 lg:justify-end"
                    >
                      <button
                        onClick={() => setEditingPayment(payment)}
                        title="Editează"
                        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingPayment(payment)}
                        title="Șterge"
                        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notă expandată */}
                  {hasNota && isExpanded && (
                    <div className="mx-4 mb-3 px-3 py-2 rounded-md border-l-2 border-muted-foreground/30 bg-muted/30">
                      <p className="text-xs text-muted-foreground italic">{payment.nota}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {allPayments.length > 0 && (
          <div className="flex justify-center px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {allPayments.length} {allPayments.length === 1 ? 'plată' : 'plăți'} afișate
            </span>
          </div>
        )}
      </div>

      {showAddModal && <AddPaymentModal onClose={() => setShowAddModal(false)} />}
      {editingPayment && (
        <EditPaymentModal payment={editingPayment} onClose={() => setEditingPayment(null)} />
      )}
      {deletingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Șterge plata</p>
              <p className="text-sm text-muted-foreground mt-1">
                {deletingPayment.client_denumire && (
                  <span className="font-medium text-foreground">{deletingPayment.client_denumire} — </span>
                )}
                {formatRON(deletingPayment.suma)} · {formatDate(deletingPayment.data_scadenta)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Această acțiune nu poate fi anulată.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingPayment(null)}
              >
                Anulează
              </Button>
              <Button
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => setDeletingPayment(null)}
              >
                Șterge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
