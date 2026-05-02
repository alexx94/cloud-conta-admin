import { useState } from 'react'
import { Fragment } from 'react'
import { Building2, FileText, ChevronDown, Pencil, Trash2, Check, MoreVertical } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchPicker, type PickerOption } from '@/components/ui/search-picker'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { paymentListOptions, clientPickerOptions, paymentKeys } from '@/features/payments/queries'
import { deletePaymentOptions } from '@/features/payments/api/payment-mutations'
import { PAGE_SIZE } from '@/features/payments/api/payments'
import type {
  PaymentStatusFilter,
  PaymentTipFilter,
  PaymentListFilter,
  PaymentRow,
  StatusPlata,
  TipPlata,
} from '@/features/payments/types'
import { EditPaymentModal } from './EditPaymentModal'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2025 + 2 }, (_, i) => 2025 + i)

const MONTHS = [
  { id: 1, short: 'Ian' }, { id: 2, short: 'Feb' }, { id: 3, short: 'Mar' },
  { id: 4, short: 'Apr' }, { id: 5, short: 'Mai' }, { id: 6, short: 'Iun' },
  { id: 7, short: 'Iul' }, { id: 8, short: 'Aug' }, { id: 9, short: 'Sep' },
  { id: 10, short: 'Oct' }, { id: 11, short: 'Nov' }, { id: 12, short: 'Dec' },
]

const STATUS_FILTERS: { id: PaymentStatusFilter; label: string }[] = [
  { id: 'all', label: 'Toate' },
  { id: 'in_lucru', label: 'În lucru' },
  { id: 'depasit', label: 'Depășite' },
  { id: 'platit', label: 'Plătite' },
  { id: 'anulat', label: 'Anulate' },
]

const TIP_OPTIONS: { value: PaymentTipFilter; label: string }[] = [
  { value: 'all', label: 'Toate tipurile' },
  { value: 'contractuala', label: 'Contractuale' },
  { value: 'manuala', label: 'Manuale' },
  { value: 'penalizare', label: 'Penalizări' },
]

const statusConfig: Record<StatusPlata, { label: string; variant: 'success' | 'warning' | 'destructive' | 'outline' }> = {
  platit: { label: 'Plătit', variant: 'success' },
  in_lucru: { label: 'În lucru', variant: 'warning' },
  depasit: { label: 'Depășit', variant: 'destructive' },
  anulat: { label: 'Anulat', variant: 'outline' },
}

const tipConfig: Record<TipPlata, { label: string }> = {
  contractuala: { label: 'Contractuală' },
  manuala: { label: 'Manuală' },
  penalizare: { label: 'Penalizare' },
}

function formatRON(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency', currency: 'RON', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateShort(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' })
}

function formatDateFull(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function YearDropdown({ year, onChange }: { year: number; onChange: (y: number) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="h-7 flex items-center gap-1.5 px-2.5 rounded-md border border-primary/40 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {year}
        <ChevronDown className="size-3 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-10 top-full mt-1 right-0 bg-background border border-border rounded-md shadow-md min-w-[72px] py-1">
          {YEARS.map(y => (
            <button
              key={y}
              onMouseDown={() => { onChange(y); setOpen(false) }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors flex items-center justify-between gap-3"
            >
              <span className={y === year ? 'text-primary font-semibold' : ''}>{y}</span>
              {y === year && <Check className="size-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TipDropdown({ value, onChange }: { value: PaymentTipFilter; onChange: (v: PaymentTipFilter) => void }) {
  const [open, setOpen] = useState(false)
  const current = TIP_OPTIONS.find(o => o.value === value)!

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="h-9 flex items-center gap-1.5 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {current.label}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-10 top-full mt-1 left-0 bg-background border border-border rounded-md shadow-md min-w-full py-1">
          {TIP_OPTIONS.map(o => (
            <button
              key={o.value}
              onMouseDown={() => { onChange(o.value); setOpen(false) }}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors flex items-center justify-between gap-4"
            >
              <span className={o.value === value ? 'text-primary font-medium' : ''}>{o.label}</span>
              {o.value === value && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DeletePaymentDialog({
  payment,
  isPending,
  onClose,
  onConfirm,
}: {
  payment: PaymentRow
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => { if (!isPending) onClose() }}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-9 rounded-full bg-destructive/10 shrink-0">
              <Trash2 className="size-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Șterge plata definitiv</p>
              {payment.client_denumire && (
                <p className="text-xs text-muted-foreground mt-0.5">{payment.client_denumire}</p>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Sumă</span>
              <span className="text-sm font-semibold tabular-nums">{formatRON(payment.suma)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Scadență</span>
              <span className="text-sm">{formatDateFull(payment.data_scadenta)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Tip</span>
              <span className="text-sm">{tipConfig[payment.tip].label}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge variant={statusConfig[payment.status].variant}>
                {statusConfig[payment.status].label}
              </Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Această acțiune este <span className="font-semibold text-destructive">permanentă</span> și nu poate fi anulată.
          </p>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Anulează
          </Button>
          <Button
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
            disabled={isPending}
            loading={isPending}
          >
            {isPending ? 'Se șterge...' : 'Șterge definitiv'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function RowActionsMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute z-20 right-0 top-full mt-1 bg-background border border-border rounded-md shadow-md py-1 min-w-[130px]">
          <button
            onMouseDown={() => { onEdit(); setOpen(false) }}
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            Editează
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            onMouseDown={() => { onDelete(); setOpen(false) }}
            className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Șterge
          </button>
        </div>
      )}
    </div>
  )
}

export function PaymentsTable() {
  const [page, setPage] = useState(0)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [month, setMonth] = useState<number | null>(null)
  const [status, setStatus] = useState<PaymentStatusFilter>('all')
  const [tip, setTip] = useState<PaymentTipFilter>('all')
  const [selectedClient, setSelectedClient] = useState<PickerOption | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<PaymentRow | null>(null)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    ...deletePaymentOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      toast.success('Plată ștearsă.')
      setDeletingPayment(null)
    },
  })

  const filter: PaymentListFilter = {
    page, year, month, status, tip, clientId: selectedClient?.id ?? null,
  }

  const { data, isFetching } = useQuery(paymentListOptions(filter))
  const items = data?.items ?? []
  const total = data?.count ?? 0
  const pageCount = Math.ceil(total / PAGE_SIZE)

  const hasActiveFilters = month !== null || status !== 'all' || tip !== 'all' || selectedClient !== null
  const emptyMessage = hasActiveFilters
    ? 'Nicio plată pentru filtrele selectate.'
    : 'Nicio plată înregistrată.'

  function resetPage() { setPage(0); setExpandedId(null) }
  function handleYearChange(y: number) { setYear(y); setMonth(null); resetPage() }
  function handleMonthChange(m: number | null) { setMonth(m); resetPage() }
  function handleStatusChange(s: PaymentStatusFilter) { setStatus(s); resetPage() }
  function handleTipChange(t: PaymentTipFilter) { setTip(t); resetPage() }
  function handleClientChange(opt: PickerOption | null) { setSelectedClient(opt); resetPage() }
  function handlePageChange(p: number) { setPage(p); setExpandedId(null) }
  function toggleExpand(payment: PaymentRow) {
    if (!payment.nota) return
    setExpandedId(id => id === payment.id ? null : payment.id)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Month + Year */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 pb-0.5">
          <button
            onClick={() => handleMonthChange(null)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              month === null
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            Toate
          </button>
          {MONTHS.map(m => (
            <button
              key={m.id}
              onClick={() => handleMonthChange(m.id)}
              className={cn(
                'shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                month === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {m.short}
            </button>
          ))}
        </div>
        <YearDropdown year={year} onChange={handleYearChange} />
      </div>

      <div className={cn(
        'bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-opacity',
        isFetching && 'opacity-60',
      )}>
        {/* Status + Tip + Client filters */}
        <div className="flex flex-col gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleStatusChange(f.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    status === f.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
              <TipDropdown value={tip} onChange={handleTipChange} />
              <SearchPicker
                value={selectedClient}
                onChange={handleClientChange}
                searchPlaceholder="Caută client..."
                queryOptions={clientPickerOptions}
                className="w-52"
              />
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 [box-shadow:inset_0_1px_0_0_hsl(var(--primary)/0.08)]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[28%]">Client</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-24">Contract</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-28">Sumă</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell w-28">Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tip</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                items.map(payment => {
                  const isExpanded = expandedId === payment.id
                  const hasNota = !!payment.nota
                  return (
                    <Fragment key={payment.id}>
                      <tr
                        onClick={() => toggleExpand(payment)}
                        className={cn(
                          'group border-l-2 transition-colors',
                          hasNota ? 'cursor-pointer' : '',
                          isExpanded
                            ? 'border-l-primary/50 bg-muted/20'
                            : 'border-l-transparent hover:bg-muted/30',
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {payment.client_denumire ?? <span className="italic text-muted-foreground">—</span>}
                              </p>
                              {payment.client_cif && (
                                <p className="text-xs text-muted-foreground">{payment.client_cif}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="size-3 shrink-0" />
                            <span className="text-xs">#{payment.contract_id ?? '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 tabular-nums font-medium">
                          {formatRON(payment.suma)}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                              {formatDateShort(payment.data_emitere)}
                            </span>
                            <span className={cn(
                              'text-xs font-medium',
                              payment.status === 'depasit'
                                ? 'text-destructive'
                                : 'text-muted-foreground',
                            )}>
                              {formatDateShort(payment.data_scadenta)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{tipConfig[payment.tip].label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Badge variant={statusConfig[payment.status].variant}>
                              {statusConfig[payment.status].label}
                            </Badge>
                            {hasNota && (
                              <ChevronDown className={cn(
                                'size-3.5 text-muted-foreground transition-transform',
                                isExpanded && 'rotate-180',
                              )} />
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <RowActionsMenu
                            onEdit={() => setEditingPayment(payment)}
                            onDelete={() => setDeletingPayment(payment)}
                          />
                        </td>
                      </tr>
                      {hasNota && isExpanded && (
                        <tr className="border-l-2 border-l-primary/30 bg-muted/10">
                          <td colSpan={7} className="px-6 py-2.5">
                            <p className="text-xs text-muted-foreground italic">{payment.nota}</p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border/60">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            items.map(payment => {
              const isExpanded = expandedId === payment.id
              const hasNota = !!payment.nota
              return (
                <div key={payment.id} className={cn('border-l-2 transition-colors', isExpanded ? 'border-l-primary/50' : 'border-l-transparent')}>
                  <div
                    onClick={() => toggleExpand(payment)}
                    className={cn('flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors', hasNota && 'cursor-pointer')}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {payment.client_denumire ?? <span className="italic text-muted-foreground">—</span>}
                        </p>
                        <Badge variant={statusConfig[payment.status].variant} className="shrink-0">
                          {statusConfig[payment.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                        <span className="text-xs text-muted-foreground">#{payment.contract_id ?? '—'}</span>
                        <span className="text-sm font-medium tabular-nums">{formatRON(payment.suma)}</span>
                        <Badge variant="outline">{tipConfig[payment.tip].label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                        <span>{formatDateShort(payment.data_emitere)}</span>
                        <span className={cn(payment.status === 'depasit' && 'text-destructive font-medium')}>
                          Scad. {formatDateShort(payment.data_scadenta)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      {hasNota && (
                        <ChevronDown className={cn('size-3.5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                      )}
                      <RowActionsMenu
                        onEdit={() => setEditingPayment(payment)}
                        onDelete={() => setDeletingPayment(payment)}
                      />
                    </div>
                  </div>
                  {hasNota && isExpanded && (
                    <div className="mx-4 mb-3 px-3 py-2 rounded-md border-l-2 border-muted-foreground/20 bg-muted/20">
                      <p className="text-xs text-muted-foreground italic">{payment.nota}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {total > 0 && pageCount <= 1 && (
          <div className="px-4 py-3 border-t border-border text-center">
            <span className="text-xs text-muted-foreground">
              {total} {total === 1 ? 'plată' : 'plăți'}
            </span>
          </div>
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>

      {editingPayment && (
        <EditPaymentModal payment={editingPayment} onClose={() => setEditingPayment(null)} />
      )}

      {deletingPayment && (
        <DeletePaymentDialog
          payment={deletingPayment}
          isPending={deleteMutation.isPending}
          onClose={() => setDeletingPayment(null)}
          onConfirm={() => deleteMutation.mutate(deletingPayment.id)}
        />
      )}
    </div>
  )
}
