import { supabase } from "@/lib/supabase";
import type { Moneda, MotivIncetare } from '@/features/contracts/types'

export type ContractListFilter = {
   cursor: number | undefined
   direction: 'forward' | 'backward'
   status: 'all' | 'active' | 'inactive'
   clientId: number | null
   contabilId: number | null
}

export type ContractCreateInput = {
   client_id: number
   client_uid: string | null
   contabil_id: number | null
   contabil_uid: string | null
   tarif_lunar: number
   moneda: Moneda
   este_activ: boolean
   data_inceput: string
   data_sfarsit: string | null
}

export type ContractUpdatePatch = {
   contabil_id: number | null
   contabil_uid: string | null
   tarif_lunar: number
   moneda: Moneda
   modified_at: string
}

export type ContractTerminatePatch = {
   este_activ: false
   data_sfarsit: string
   motiv_incetare: MotivIncetare
   modified_at: string
}

export const PAGE_SIZE = 25

export const getContractsCounts = async () => {
   const { count, error } = await supabase
      .from('CONTRACT_SERVICII')
      .select('*', { count: 'exact', head: true })
      .eq('este_activ', true);

   if (error) throw new Error(error.message);
   return count ?? 0;
}

export const getContracts = async (filters: ContractListFilter) => {
   let query = supabase
      .from('CONTRACT_SERVICII')
      .select(`
         id,
         este_activ,
         data_inceput,
         data_sfarsit,
         tarif_lunar,
         moneda,
         motiv_incetare,
         contabil_uid,
         created_at,
         modified_at,
         client:CLIENT!fk_contract_client ( id, denumire, cif ),
         contabil:CONTABIL!fk_contract_contabil ( id, denumire )
      `)
      .limit(PAGE_SIZE + 1)

   if (filters.direction === 'forward') {
      query = query.order('id', { ascending: true })
      if (filters.cursor !== undefined) query = query.gt('id', filters.cursor)
   } else {
      query = query.order('id', { ascending: false })
      if (filters.cursor !== undefined) query = query.lt('id', filters.cursor)
   }

   if (filters.status === 'active')   query = query.eq('este_activ', true)
   if (filters.status === 'inactive') query = query.eq('este_activ', false)
   if (filters.clientId !== null)     query = query.eq('client_id', filters.clientId)
   if (filters.contabilId !== null)   query = query.eq('contabil_id', filters.contabilId)

   const { data, error } = await query
   if (error) throw new Error(error.message)

   const raw = data ?? []
   const hasMore = raw.length > PAGE_SIZE
   const items = raw.slice(0, PAGE_SIZE)

   return {
      items: filters.direction === 'backward' ? [...items].reverse() : items,
      hasMore,
   }
}

export const getContractsLastCursor = async (total: number, pageSize = PAGE_SIZE) => {
   const lastPageSize = total % pageSize || pageSize
   const cursorIndex = total - lastPageSize - 1
   if (cursorIndex < 0) return undefined

   const { data, error } = await supabase
      .from('CONTRACT_SERVICII')
      .select('id')
      .order('id', { ascending: true })
      .range(cursorIndex, cursorIndex)

   if (error) throw new Error(error.message)
   return data?.[0]?.id as number | undefined
}

export const createContract = async (input: ContractCreateInput) => {
   const { error } = await supabase.from('CONTRACT_SERVICII').insert(input)
   if (error) throw new Error(error.message)
}

export const updateContract = async (id: number, patch: ContractUpdatePatch) => {
   const { error } = await supabase
      .from('CONTRACT_SERVICII')
      .update(patch)
      .eq('id', id)
   if (error) throw new Error(error.message)
}

export const terminateContract = async (id: number, patch: ContractTerminatePatch) => {
   const { error } = await supabase
      .from('CONTRACT_SERVICII')
      .update(patch)
      .eq('id', id)
   if (error) throw new Error(error.message)
}

export const reactivateContract = async (id: number) => {
   const { error } = await supabase
      .from('CONTRACT_SERVICII')
      .update({
         este_activ: true,
         data_sfarsit: null,
         motiv_incetare: null,
         modified_at: new Date().toISOString(),
      })
      .eq('id', id)
   if (error) throw new Error(error.message)
}
