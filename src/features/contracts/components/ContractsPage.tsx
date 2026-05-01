import { useState } from 'react'
import { Fragment } from 'react'
import {
   Plus, Pencil, X, Check, ChevronDown,
   ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchPicker, type PickerOption } from '@/components/ui/search-picker'
import { clientKeys } from '@/shared/api/clients/queries'
import { accountantKeys } from '@/shared/api/accountants/queries'
import { searchClients } from '@/shared/api/clients/api'
import { searchAccountants } from '@/shared/api/accountants/api'
import {
   contractListOptions,
   contractTotalCountOptions,
   type ContractListFilter,
} from '@/shared/contracts/queries'
import { getContractsLastCursor, PAGE_SIZE } from '@/shared/contracts/api'
import { EditContractModal } from './EditContractModal'
import { CreateContractModal } from './CreateContractModal'
import type { ContractRow, ContractStatus, MotivIncetare } from '../types'

const motivLabels: Record<MotivIncetare, string> = {
   expirare_naturala: 'Expirare naturală',
   reziliere_client: 'Reziliere client',
   reziliere_contabil: 'Reziliere contabil',
   neplata: 'Neplată',
   alt_motiv: 'Alt motiv',
}

// Module-level picker option factories — stable refs, no useCallback needed
function clientPickerOptions(term: string) {
   return {
      queryKey: clientKeys.search(term),
      queryFn: () => searchClients(term),
      enabled: term.length >= 2,
      staleTime: 30_000,
      select: (data: Array<{ id: number; denumire: string; cif: string }>): PickerOption[] =>
         data.map(r => ({ id: r.id, label: r.denumire, sub: r.cif })),
   }
}

function contabilPickerOptions(term: string) {
   return {
      queryKey: accountantKeys.search(term),
      queryFn: () => searchAccountants(term),
      enabled: term.length >= 2,
      staleTime: 30_000,
      select: (data: Array<{ id: number; denumire: string; email: string | null }>): PickerOption[] =>
         data.map(r => ({ id: r.id, label: r.denumire })),
   }
}

function formatDate(date: string | null) {
   if (!date) return '—'
   return new Date(date).toLocaleDateString('ro-RO', {
      day: '2-digit', month: 'short', year: 'numeric',
   })
}

type StatusOption = { value: ContractStatus; label: string }

const STATUS_OPTIONS: StatusOption[] = [
   { value: 'all', label: 'Toate' },
   { value: 'active', label: 'Active' },
   { value: 'inactive', label: 'Inactive' },
]

function StatusDropdown({ value, onChange }: { value: ContractStatus; onChange: (v: ContractStatus) => void }) {
   const [open, setOpen] = useState(false)
   const current = STATUS_OPTIONS.find(o => o.value === value)!

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
               {STATUS_OPTIONS.map(o => (
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

export function ContractsPage() {
   const [cursor, setCursor] = useState<number | undefined>(undefined)
   const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
   const [status, setStatus] = useState<ContractStatus>('all')
   const [selectedClient, setSelectedClient] = useState<PickerOption | null>(null)
   const [selectedContabil, setSelectedContabil] = useState<PickerOption | null>(null)
   const [selected, setSelected] = useState<ContractRow | null>(null)
   const [showEdit, setShowEdit] = useState(false)
   const [showCreate, setShowCreate] = useState(false)
   const [expandedId, setExpandedId] = useState<number | null>(null)

   function toggleExpand(e: React.MouseEvent, id: number) {
      e.stopPropagation()
      setExpandedId(prev => prev === id ? null : id)
   }

   function openEdit(contract: ContractRow) {
      setSelected(contract)
      setShowEdit(true)
   }

   const hasActiveFilters = status !== 'all' || selectedClient !== null || selectedContabil !== null

   const filter: ContractListFilter = {
      cursor,
      direction,
      status,
      clientId: selectedClient?.id ?? null,
      contabilId: selectedContabil?.id ?? null,
   }

   const { data, isFetching } = useQuery(contractListOptions(filter))
   const { data: totalCount = 0 } = useQuery(contractTotalCountOptions)

   const items = (data?.items ?? []) as ContractRow[]
   const hasMore = data?.hasMore ?? false
   const hasData = data !== undefined
   const isFirstPage = direction === 'forward' ? cursor === undefined : (hasData && !hasMore)
   const isLastPage = direction === 'backward' ? cursor === undefined : (hasData && !hasMore)

   const emptyMessage = hasActiveFilters
      ? 'Niciun contract găsit pentru filtrele selectate.'
      : 'Niciun contract înregistrat.'

   function resetPagination() {
      setCursor(undefined)
      setDirection('forward')
      setSelected(null)
   }

   function handleStatusChange(v: ContractStatus) {
      setStatus(v)
      resetPagination()
   }

   function handleClientChange(opt: PickerOption | null) {
      setSelectedClient(opt)
      resetPagination()
   }

   function handleContabilChange(opt: PickerOption | null) {
      setSelectedContabil(opt)
      resetPagination()
   }

   function handleResetFilters() {
      setStatus('all')
      setSelectedClient(null)
      setSelectedContabil(null)
      resetPagination()
   }

   function goFirst() {
      setCursor(undefined)
      setDirection('forward')
      setSelected(null)
   }

   function goNext() {
      setCursor(items.at(-1)?.id)
      setDirection('forward')
      setSelected(null)
   }

   function goPrev() {
      setCursor(items[0]?.id)
      setDirection('backward')
      setSelected(null)
   }

   async function goLast() {
      const lastCursor = await getContractsLastCursor(totalCount, PAGE_SIZE)
      setCursor(lastCursor)
      setDirection('forward')
      setSelected(null)
   }

   function toggleSelect(contract: ContractRow) {
      setSelected(prev => prev?.id === contract.id ? null : contract)
   }

   function handleEditClick() {
      if (!selected) {
         toast.info('Selectează un rând din tabel mai întâi.')
         return
      }
      setShowEdit(true)
   }

   return (
      <div className="flex flex-col gap-6">
         <PageHeader
            title="Contracte"
            description="Gestionează relațiile client–contabil și tarifele."
         />

         <div className="flex flex-col gap-4">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
               <StatusDropdown value={status} onChange={handleStatusChange} />

               <SearchPicker
                  value={selectedClient}
                  onChange={handleClientChange}
                  searchPlaceholder="Caută client..."
                  queryOptions={clientPickerOptions}
                  className="w-64"
               />

               <SearchPicker
                  value={selectedContabil}
                  onChange={handleContabilChange}
                  searchPlaceholder="Caută contabil..."
                  queryOptions={contabilPickerOptions}
                  className="w-64"
               />

               {hasActiveFilters && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleResetFilters}
                     className="gap-1.5 text-muted-foreground"
                  >
                     <X className="size-3.5" />
                     Resetează
                  </Button>
               )}

               <div className="flex items-center gap-2 ml-auto shrink-0">
                  <Button
                     variant="outline"
                     className="hidden md:flex gap-1.5"
                     onClick={handleEditClick}
                     disabled={!selected}
                  >
                     <Pencil className="size-3.5" />
                     Editează
                  </Button>
                  <Button className="gap-1.5" onClick={() => setShowCreate(true)}>
                     <Plus className="size-4" />
                     Contract nou
                  </Button>
               </div>
            </div>

            {/* Table */}
            <div className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-opacity ${isFetching ? 'opacity-60' : ''}`}>

               {/* Mobile: carduri */}
               <div className="md:hidden divide-y divide-border/60">
                  {items.length === 0 ? (
                     <div className="py-12 text-center text-sm text-muted-foreground">
                        {emptyMessage}
                     </div>
                  ) : (
                     items.map(contract => (
                        <div
                           key={contract.id}
                           onClick={() => toggleSelect(contract)}
                           className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 border-l-2 ${
                              selected?.id === contract.id ? 'border-l-primary bg-primary/5' : 'border-l-transparent'
                           }`}
                        >
                           <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                 {contract.client?.denumire ?? <span className="italic text-muted-foreground">Client necunoscut</span>}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                 {contract.contabil?.denumire ?? '—'} · {contract.tarif_lunar} {contract.moneda}
                              </p>
                              {contract.motiv_incetare && (
                                 <p className="text-xs text-muted-foreground/60 truncate">
                                    {motivLabels[contract.motiv_incetare]}
                                 </p>
                              )}
                           </div>
                           <div className="flex items-center gap-2 shrink-0">
                              <button
                                 onClick={e => { e.stopPropagation(); openEdit(contract) }}
                                 className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                 <Pencil className="size-3.5" />
                              </button>
                              <Badge
                                 variant={contract.este_activ ? 'success' : 'outline'}
                                 className={contract.este_activ ? 'ring-1 ring-green-400/30' : ''}
                              >
                                 {contract.este_activ ? 'Activ' : 'Inactiv'}
                              </Badge>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               {/* Desktop: tabel */}
               <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                        <tr className="border-b border-border bg-muted/40 [box-shadow:inset_0_1px_0_0_hsl(var(--primary)/0.12)]">
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[26%]">Client</th>
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[20%]">Contabil</th>
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-28">Tarif</th>
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Perioadă</th>
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Modificat</th>
                           <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-24">Statut</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/60">
                        {items.length === 0 ? (
                           <tr>
                              <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                                 {emptyMessage}
                              </td>
                           </tr>
                        ) : (
                           items.map(contract => (
                              <Fragment key={contract.id}>
                                 <tr
                                    onClick={() => toggleSelect(contract)}
                                    className={`cursor-pointer border-l-2 transition-colors ${
                                       selected?.id === contract.id
                                          ? 'border-l-primary bg-primary/5 hover:bg-primary/5'
                                          : 'border-l-transparent hover:bg-muted/30'
                                    }`}
                                 >
                                    <td className="px-4 py-3">
                                       <p className="font-medium text-foreground truncate">
                                          {contract.client?.denumire ?? <span className="italic text-muted-foreground">—</span>}
                                       </p>
                                       {contract.client?.cif && (
                                          <p className="text-xs text-muted-foreground">{contract.client.cif}</p>
                                       )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground truncate max-w-40">
                                       {contract.contabil?.denumire ?? <span className="italic">—</span>}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">
                                       <span className="font-medium">{contract.tarif_lunar}</span>
                                       <span className="text-xs text-muted-foreground ml-1">{contract.moneda}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                                       {formatDate(contract.data_inceput)}
                                       <span className="mx-1 text-muted-foreground/40">—</span>
                                       {contract.data_sfarsit ? formatDate(contract.data_sfarsit) : <span className="text-emerald-600 dark:text-emerald-400">prezent</span>}
                                    </td>
                                    <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground">
                                       {formatDate(contract.modified_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                       <div className="flex items-center gap-2">
                                          <Badge
                                             variant={contract.este_activ ? 'success' : 'outline'}
                                             className={contract.este_activ ? 'ring-1 ring-green-400/30' : ''}
                                          >
                                             {contract.este_activ ? 'Activ' : 'Inactiv'}
                                          </Badge>
                                          {contract.motiv_incetare && (
                                             <button
                                                onClick={e => toggleExpand(e, contract.id)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                title={motivLabels[contract.motiv_incetare]}
                                             >
                                                <ChevronDown className={`size-3.5 transition-transform ${expandedId === contract.id ? 'rotate-180' : ''}`} />
                                             </button>
                                          )}
                                       </div>
                                    </td>
                                 </tr>
                                 {contract.motiv_incetare && expandedId === contract.id && (
                                    <tr className="border-l-2 border-l-transparent bg-muted/20">
                                       <td colSpan={6} className="px-4 py-2 text-xs text-muted-foreground">
                                          <span className="font-medium">Motiv încetare:</span>
                                          {' '}{motivLabels[contract.motiv_incetare]}
                                       </td>
                                    </tr>
                                 )}
                              </Fragment>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Pagination */}
               <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-border">
                  <Button variant="outline" size="sm" disabled={isFirstPage || isFetching} onClick={goFirst}>
                     <ChevronsLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isFirstPage || isFetching} onClick={goPrev}>
                     <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLastPage || isFetching} onClick={goNext}>
                     <ChevronRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLastPage || isFetching || hasActiveFilters} onClick={goLast}>
                     <ChevronsRight className="size-4" />
                  </Button>
               </div>
            </div>
         </div>

         {showEdit && selected && (
            <EditContractModal
               contract={selected}
               onClose={() => setShowEdit(false)}
               onSuccess={() => setSelected(null)}
            />
         )}

         {showCreate && (
            <CreateContractModal onClose={() => setShowCreate(false)} />
         )}
      </div>
   )
}
