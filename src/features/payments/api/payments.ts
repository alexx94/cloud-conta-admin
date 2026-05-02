import { supabase } from '@/lib/supabase'
import type {
  PaymentListFilter,
  PaymentCountFilter,
  PaymentRow,
  PaymentStats,
  ClientContract,
} from '@/features/payments/types'

export const PAGE_SIZE = 20

function buildDateRange(year: number, month: number | null) {
  if (month !== null) {
    const lastDay = new Date(year, month, 0).getDate()
    return {
      from: `${year}-${String(month).padStart(2, '0')}-01`,
      to: `${year}-${String(month).padStart(2, '0')}-${lastDay}`,
    }
  }
  return { from: `${year}-01-01`, to: `${year}-12-31` }
}

export const getPayments = async (filters: PaymentListFilter): Promise<{ items: PaymentRow[]; count: number }> => {
  const { page, year, month, status, tip, clientId } = filters
  const { from, to } = buildDateRange(year, month)
  const offset = page * PAGE_SIZE

  let contractIds: number[] | null = null
  if (clientId !== null) {
    const { data: contracts } = await supabase
      .from('CONTRACT_SERVICII')
      .select('id')
      .eq('client_id', clientId)
    contractIds = (contracts ?? []).map(c => c.id)
    if (contractIds.length === 0) return { items: [], count: 0 }
  }

  let query = supabase
    .from('PLATA')
    .select(
      `id, data_emitere, data_scadenta, data_plata, suma, status, tip, metoda, nota,
       contract:CONTRACT_SERVICII!PLATA_contract_servicii_fkey(
         id,
         client:CLIENT!fk_contract_client(id, denumire, cif)
       )`,
      { count: 'exact' },
    )
    .gte('data_emitere', from)
    .lte('data_emitere', to)
    .order('data_emitere', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (status !== 'all') query = query.eq('status', status)
  if (tip !== 'all') query = query.eq('tip', tip)
  if (contractIds !== null) query = query.in('contract_servicii', contractIds)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const items: PaymentRow[] = (data ?? []).map(p => {
    const contract = Array.isArray(p.contract) ? p.contract[0] : p.contract
    const client = contract
      ? Array.isArray(contract.client) ? contract.client[0] : contract.client
      : null
    return {
      id: p.id,
      data_emitere: p.data_emitere,
      data_scadenta: p.data_scadenta,
      data_plata: p.data_plata,
      suma: p.suma,
      status: p.status,
      tip: p.tip,
      metoda: p.metoda,
      nota: p.nota,
      contract_id: contract?.id ?? null,
      client_id: client?.id ?? null,
      client_denumire: client?.denumire ?? null,
      client_cif: client?.cif ?? null,
    }
  })

  return { items, count: count ?? 0 }
}

export const getPaymentStats = async (dateFrom: string, dateTo: string): Promise<PaymentStats> => {
  const { data, error } = await supabase.rpc('get_payment_stats', {
    p_date_from: dateFrom,
    p_date_to: dateTo,
  })
  if (error) throw new Error(error.message)
  return (data ?? { total_incasat: 0, total_neincasat: 0, total_depasit: 0 }) as PaymentStats
}

export const getClientContracts = async (clientId: number): Promise<ClientContract[]> => {
  const { data, error } = await supabase
    .from('CONTRACT_SERVICII')
    .select('id, tarif_lunar, moneda, data_inceput')
    .eq('client_id', clientId)
    .eq('este_activ', true)
  if (error) throw new Error(error.message)
  return data ?? []
}

export const getPaymentCount = async (filters: PaymentCountFilter): Promise<number> => {
  const { year, month, status, tip, clientId } = filters
  const { from, to } = buildDateRange(year, month)

  let contractIds: number[] | null = null
  if (clientId !== null) {
    const { data: contracts } = await supabase
      .from('CONTRACT_SERVICII')
      .select('id')
      .eq('client_id', clientId)
    contractIds = (contracts ?? []).map(c => c.id)
    if (contractIds.length === 0) return 0
  }

  let query = supabase
    .from('PLATA')
    .select('*', { count: 'exact', head: true })
    .gte('data_emitere', from)
    .lte('data_emitere', to)

  if (status !== 'all') query = query.eq('status', status)
  if (tip !== 'all') query = query.eq('tip', tip)
  if (contractIds !== null) query = query.in('contract_servicii', contractIds)

  const { count, error } = await query
  if (error) throw new Error(error.message)
  return count ?? 0
}
