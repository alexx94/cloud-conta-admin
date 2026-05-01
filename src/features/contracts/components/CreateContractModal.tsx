import { useState } from 'react'
import { X, Search, Check } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createContractOptions } from '@/features/contracts/api/contract-mutations'
import { contractKeys } from '@/shared/contracts/queries'
import { clientKeys } from '@/shared/api/clients/queries'
import { accountantKeys } from '@/shared/api/accountants/queries'
import { searchClients } from '@/shared/api/clients/api'
import { searchAccountants } from '@/shared/api/accountants/api'
import type { Moneda } from '@/features/contracts/types'

type ClientResult = { id: number; denumire: string; cif: string; user_id: string | null }
type ContabilResult = { id: number; denumire: string; user_id: string | null }

const MONEDE: Moneda[] = ['RON', 'EUR', 'USD', 'GBP', 'CHF']

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

function ClientPicker({
   value,
   onSelect,
   disabled,
}: {
   value: ClientResult | null
   onSelect: (c: ClientResult | null) => void
   disabled?: boolean
}) {
   const [search, setSearch] = useState('')
   const [open, setOpen] = useState(false)

   const { data: results = [] } = useQuery({
      queryKey: clientKeys.search(search),
      queryFn: () => searchClients(search),
      enabled: search.length >= 2,
      staleTime: 30_000,
   })

   if (value) {
      return (
         <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-background text-sm">
            <div className="flex items-center gap-2 min-w-0">
               <Check className="size-3.5 text-primary shrink-0" />
               <span className="truncate">{value.denumire}</span>
               {value.cif && <span className="text-xs text-muted-foreground shrink-0">{value.cif}</span>}
            </div>
            {!disabled && (
               <button onClick={() => onSelect(null)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2">
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
                        onMouseDown={() => { onSelect(r as ClientResult); setOpen(false); setSearch('') }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between gap-2"
                     >
                        <span className="truncate">{r.denumire}</span>
                        {r.cif && <span className="text-xs text-muted-foreground shrink-0">{r.cif}</span>}
                     </button>
                  ))
               )}
            </div>
         )}
      </div>
   )
}

function ContabilPicker({
   value,
   onSelect,
   disabled,
}: {
   value: ContabilResult | null
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

   if (value) {
      return (
         <div className="flex items-center justify-between h-9 px-3 rounded-md border border-input bg-background text-sm">
            <div className="flex items-center gap-2 min-w-0">
               <Check className="size-3.5 text-primary shrink-0" />
               <span className="truncate">{value.denumire}</span>
            </div>
            {!disabled && (
               <button onClick={() => onSelect(null)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2">
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
   onClose: () => void
}

export function CreateContractModal({ onClose }: Props) {
   const [client, setClient] = useState<ClientResult | null>(null)
   const [contabil, setContabil] = useState<ContabilResult | null>(null)
   const [tarifLunar, setTarifLunar] = useState('')
   const [moneda, setMoneda] = useState<Moneda>('RON')
   const [esteActiv, setEsteActiv] = useState(true)
   const [dataInceput, setDataInceput] = useState(() => new Date().toISOString().split('T')[0])
   const [dataSfarsit, setDataSfarsit] = useState('')

   const queryClient = useQueryClient()

   const mutation = useMutation({
      ...createContractOptions,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: contractKeys.all })
         toast.success('Contract creat cu succes.')
         onClose()
      },
   })

   const canCreate = !!client && !!tarifLunar && Number(tarifLunar) > 0 && !!dataInceput

   function handleClose() {
      if (mutation.isPending) return
      onClose()
   }

   function handleCreate() {
      if (!client || !canCreate) return
      mutation.mutate({
         client_id: client.id,
         client_uid: client.user_id,
         contabil_id: contabil?.id ?? null,
         contabil_uid: contabil?.user_id ?? null,
         tarif_lunar: Number(tarifLunar),
         moneda,
         este_activ: esteActiv,
         data_inceput: dataInceput,
         data_sfarsit: dataSfarsit || null,
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
                  <h2 className="text-sm font-semibold text-foreground">Contract nou</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Asociază un client cu un contabil</p>
               </div>
               <button
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 disabled:opacity-40 disabled:pointer-events-none"
               >
                  <X className="size-4" />
               </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
               <Field label="Client" required>
                  <ClientPicker value={client} onSelect={setClient} disabled={mutation.isPending} />
               </Field>

               <Field label="Contabil">
                  <ContabilPicker value={contabil} onSelect={setContabil} disabled={mutation.isPending} />
               </Field>

               <div className="grid grid-cols-2 gap-3">
                  <Field label="Tarif lunar" required>
                     <Input
                        type="number"
                        min="1"
                        step="1"
                        value={tarifLunar}
                        onChange={e => setTarifLunar(e.target.value)}
                        placeholder="ex: 500"
                        disabled={mutation.isPending}
                     />
                  </Field>
                  <Field label="Monedă">
                     <select
                        value={moneda}
                        onChange={e => setMoneda(e.target.value as Moneda)}
                        disabled={mutation.isPending}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                     >
                        {MONEDE.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                  </Field>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <Field label="Dată început" required>
                     <Input
                        type="date"
                        value={dataInceput}
                        onChange={e => setDataInceput(e.target.value)}
                        disabled={mutation.isPending}
                     />
                  </Field>
                  <Field label="Dată sfârșit">
                     <Input
                        type="date"
                        value={dataSfarsit}
                        onChange={e => setDataSfarsit(e.target.value)}
                        disabled={mutation.isPending}
                     />
                  </Field>
               </div>

               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                     type="checkbox"
                     checked={esteActiv}
                     onChange={e => setEsteActiv(e.target.checked)}
                     disabled={mutation.isPending}
                     className="h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm text-foreground">Contract activ</span>
               </label>
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-border shrink-0">
               <Button variant="outline" className="flex-1" onClick={handleClose} disabled={mutation.isPending}>
                  Anulează
               </Button>
               <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={!canCreate || mutation.isPending}
                  loading={mutation.isPending}
               >
                  {mutation.isPending ? 'Se creează...' : 'Creează contract'}
               </Button>
            </div>
         </div>
      </div>
   )
}
