import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { clientKeys } from '@/shared/api/clients/queries'
import { searchClients } from '@/shared/api/clients/api'
import type { PickerOption } from '@/components/ui/search-picker'
import {
  getPayments,
  getPaymentCount,
  getPaymentStats,
  getClientContracts,
} from '@/features/payments/api/payments'
import type { PaymentListFilter, PaymentCountFilter } from '@/features/payments/types'

export type { PaymentListFilter, PaymentCountFilter } from '@/features/payments/types'

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (f: PaymentListFilter) => [...paymentKeys.lists(), f] as const,
  counts: () => [...paymentKeys.all, 'count'] as const,
  count: (f: PaymentCountFilter) => [...paymentKeys.counts(), f] as const,
  stats: (dateFrom: string, dateTo: string) =>
    [...paymentKeys.all, 'stats', { dateFrom, dateTo }] as const,
  clientContracts: (clientId: number) =>
    [...paymentKeys.all, 'client-contracts', clientId] as const,
}

export const paymentListOptions = (filters: PaymentListFilter) =>
  queryOptions({
    queryKey: paymentKeys.list(filters),
    queryFn: () => getPayments(filters),
    placeholderData: keepPreviousData,
    meta: { errorMessage: 'Nu am putut prelua lista de plăți.' },
  })

export const paymentCountOptions = (filters: PaymentCountFilter) =>
  queryOptions({
    queryKey: paymentKeys.count(filters),
    queryFn: () => getPaymentCount(filters),
    placeholderData: keepPreviousData,
    meta: { errorMessage: 'Nu am putut prelua numărul de plăți.' },
  })

export const paymentStatsOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: paymentKeys.stats(dateFrom, dateTo),
    queryFn: () => getPaymentStats(dateFrom, dateTo),
    meta: { errorMessage: 'Nu am putut prelua statisticile de plăți.' },
  })

export function clientPickerOptions(term: string) {
  return {
    queryKey: clientKeys.search(term),
    queryFn: () => searchClients(term),
    enabled: term.length >= 2,
    staleTime: 30_000,
    select: (data: Array<{ id: number; denumire: string; cif: string }>): PickerOption[] =>
      data.map(r => ({ id: r.id, label: r.denumire, sub: r.cif })),
  }
}

export const clientContractOptions = (clientId: number | null) =>
  queryOptions({
    queryKey: [...paymentKeys.all, 'client-contracts', clientId] as const,
    queryFn: () => getClientContracts(clientId!),
    enabled: clientId !== null,
    staleTime: 30_000,
  })
