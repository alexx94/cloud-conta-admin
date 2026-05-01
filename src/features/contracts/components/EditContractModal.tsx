import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateContractOptions, terminateContractOptions, reactivateContractOptions } from '@/features/contracts/api/contract-mutations'
import { contractKeys } from '@/shared/contracts/queries'
import { searchAccountants } from '@/shared/api/accountants/api'
import { accountantKeys } from '@/shared/api/accountants/queries'
import type { ContractRow, Moneda, MotivIncetare } from '@/features/contracts/types'

type ContabilResult = { id: number; denumire: string; user_id: string | null }

const MONEDE: Moneda[] = ['RON', 'EUR', 'USD', 'GBP', 'CHF']

const motivLabels: Record<MotivIncetare, string> = {
   expirare_naturala: 'Expirare naturală',
   reziliere_client: 'Reziliere client',
   reziliere_contabil: 'Reziliere contabil',
   neplata: 'Neplată',
   alt_motiv: 'Alt motiv',
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
   return (
      <div className="flex flex-col gap-1.5">
         <label className="text-xs font-medium text-muted-foreground">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
         </label>
         {children}
      </div>
   )
}

function ContabilPicker({
   current,
   onSelect,
   disabled,
}: {
   current: ContabilResult | null
   onSelect: (c: ContabilResult | null) => void
   disabled?: boolean
}) {
   const [search, setSearch] = useState('')
   const [open, setOpen] = useState(false)

   const { data: results = [] } = useQuery({
      queryKey: accountantKeys.search(search),
      queryFn: () => searchAccountants(search),
      enabled: search.length >= 2,
      staleTime: 30_000,
   })

   function handleClear() {
      onSelect(null)
      setSearch('')
   }

   if (current) {
      return (
         <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-background text-sm">
            <div className="flex items-center gap-2 min-w-0">
               <Check className="size-3.5 text-primary shrink-0" />
               <span className="truncate">{current.denumire}</span>
            </div>
            {!disabled && (
               <button onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2">
                  <X className="size-3.5" />
               </button>
            )}
         </div>
      )
   }

   return (
      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
         <input
            type="text"
            value={search}
            disabled={disabled}
            onChange={e => { setSearch(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Minim 2 caractere..."
            className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
         />
         {open && search.length >= 2 && (
            <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
               {results.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">Niciun rezultat</p>
               ) : (
                  results.map(r => (
                     <button
                        key={r.id}
                        onMouseDown={() => { onSelect(r as ContabilResult); setOpen(false); setSearch('') }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                     >
                        {r.denumire}
                     </button>
                  ))
               )}
            </div>
         )}
      </div>
   )
}

interface Props {
   contract: ContractRow
   onClose: () => void
   onSuccess?: () => void
}

export function EditContractModal({ contract, onClose, onSuccess }: Props) {
   const initialContabil: ContabilResult | null = contract.contabil
      ? { id: contract.contabil.id, denumire: contract.contabil.denumire, user_id: contract.contabil_uid ?? null }
      : null

   const [contabil, setContabil] = useState<ContabilResult | null>(initialContabil)
   const [tarifLunar, setTarifLunar] = useState(String(contract.tarif_lunar))
   const [moneda, setMoneda] = useState<Moneda>(contract.moneda)
   const [showTerminare, setShowTerminare] = useState(false)
   const [motivIncetare, setMotivIncetare] = useState<MotivIncetare>('expirare_naturala')

   const queryClient = useQueryClient()

   function invalidate() {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
   }

   const updateMutation = useMutation({
      ...updateContractOptions(contract.id),
      onSuccess: () => {
         invalidate()
         toast.success('Contract actualizat cu succes.')
         onSuccess?.()
         onClose()
      },
   })

   const terminateMutation = useMutation({
      ...terminateContractOptions(contract.id),
      onSuccess: () => {
         invalidate()
         toast.success('Contractul a fost terminat.')
         onSuccess?.()
         onClose()
      },
   })

   const reactivateMutation = useMutation({
      ...reactivateContractOptions(contract.id),
      onSuccess: () => {
         invalidate()
         toast.success('Contractul a fost reactivat.')
         onSuccess?.()
         onClose()
      },
   })

   const isPending = updateMutation.isPending || terminateMutation.isPending || reactivateMutation.isPending

   const contabilChanged = contabil?.id !== initialContabil?.id
   const tarifChanged = Number(tarifLunar) !== contract.tarif_lunar
   const monedaChanged = moneda !== contract.moneda
   const isDirty = contabilChanged || tarifChanged || monedaChanged

   function handleClose() {
      if (isPending) return
      onClose()
   }

   function handleSave() {
      const tarif = Number(tarifLunar)
      if (!tarif || tarif <= 0) return
      updateMutation.mutate({
         contabil_id: contabil?.id ?? null,
         contabil_uid: contabil?.user_id ?? null,
         tarif_lunar: tarif,
         moneda,
         modified_at: new Date().toISOString(),
      })
   }

   function handleTerminate() {
      terminateMutation.mutate({
         este_activ: false,
         data_sfarsit: new Date().toISOString().split('T')[0],
         motiv_incetare: motivIncetare,
         modified_at: new Date().toISOString(),
      })
   }

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
         onClick={handleClose}
         onKeyDown={e => { if (e.key === 'Escape') handleClose() }}
      >
         <div
            className="bg-background border border-border rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
         >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
               <div>
                  <h2 className="text-sm font-semibold text-foreground">Editează contract #{contract.id}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                     {contract.client?.denumire ?? '—'}
                     {contract.client?.cif && <span className="ml-1 opacity-60">· {contract.client.cif}</span>}
                  </p>
               </div>
               <button
                  onClick={handleClose}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
               >
                  <X className="size-4" />
               </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
               <Field label="Contabil">
                  <ContabilPicker
                     current={contabil}
                     onSelect={setContabil}
                     disabled={isPending}
                  />
               </Field>

               <div className="grid grid-cols-2 gap-3">
                  <Field label="Tarif lunar" required>
                     <Input
                        type="number"
                        min="1"
                        step="1"
                        value={tarifLunar}
                        onChange={e => setTarifLunar(e.target.value)}
                        disabled={isPending}
                        autoFocus
                     />
                  </Field>
                  <Field label="Monedă">
                     <select
                        value={moneda}
                        onChange={e => setMoneda(e.target.value as Moneda)}
                        disabled={isPending}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                     >
                        {MONEDE.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                  </Field>
               </div>

               {/* Reactivate section — only for inactive contracts without a termination reason */}
               {!contract.este_activ && !contract.motiv_incetare && (
                  <div className="mt-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reactivateMutation.mutate()}
                        disabled={isPending}
                        loading={reactivateMutation.isPending}
                     >
                        {reactivateMutation.isPending ? 'Se reactivează...' : 'Reactivează contractul'}
                     </Button>
                  </div>
               )}

               {/* Terminate section */}
               {contract.este_activ && (
                  <div className="mt-2">
                     {!showTerminare ? (
                        <button
                           onClick={() => setShowTerminare(true)}
                           disabled={isPending}
                           className="text-xs text-destructive hover:underline disabled:opacity-40 disabled:pointer-events-none"
                        >
                           Termină contractul
                        </button>
                     ) : (
                        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col gap-3">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-destructive">Termină contractul</p>
                              <button
                                 onClick={() => setShowTerminare(false)}
                                 disabled={isPending}
                                 className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                              >
                                 <X className="size-4" />
                              </button>
                           </div>

                           <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-muted-foreground">Motiv încetare</label>
                              <select
                                 value={motivIncetare}
                                 onChange={e => setMotivIncetare(e.target.value as MotivIncetare)}
                                 disabled={isPending}
                                 className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                              >
                                 {(Object.entries(motivLabels) as [MotivIncetare, string][]).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                 ))}
                              </select>
                           </div>

                           <p className="text-xs text-muted-foreground">
                              Data de încheiere va fi setată la ziua de azi. Această acțiune nu poate fi anulată.
                           </p>

                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setShowTerminare(false)}
                                 disabled={isPending}
                              >
                                 Anulează
                              </Button>
                              <Button
                                 size="sm"
                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 onClick={handleTerminate}
                                 disabled={isPending}
                                 loading={terminateMutation.isPending}
                              >
                                 {terminateMutation.isPending ? 'Se procesează...' : 'Confirmă terminarea'}
                              </Button>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
               <Button variant="outline" className="flex-1" onClick={handleClose} disabled={isPending}>
                  Anulează
               </Button>
               <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={!isDirty || !tarifLunar || Number(tarifLunar) <= 0 || isPending}
                  loading={updateMutation.isPending}
               >
                  {updateMutation.isPending ? 'Se salvează...' : 'Salvează'}
               </Button>
            </div>
         </div>
      </div>
   )
}
