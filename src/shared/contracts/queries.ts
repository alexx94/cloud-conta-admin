import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { clientKeys } from "@/shared/api/clients/queries";
import { accountantKeys } from "@/shared/api/accountants/queries";
import { searchClients } from "@/shared/api/clients/api";
import { searchAccountants } from "@/shared/api/accountants/api";
import {
   getContractsCounts,
   getContracts,
   type ContractListFilter,
} from "./api";

export type { ContractListFilter } from "./api";

export const contractKeys = {
   all: ['contracts'] as const,
   counts: () => [...contractKeys.all, 'count'] as const,
   lists: () => [...contractKeys.all, 'list'] as const,
   list: (filters: ContractListFilter) => [...contractKeys.lists(), filters] as const,
};

export const contractCountOptions = queryOptions({
   queryKey: contractKeys.counts(),
   queryFn: getContractsCounts,
   meta: {
      errorMessage: 'Nu am putut prelua numarul de contracte active de la server.',
   }
})

export const contractTotalCountOptions = queryOptions({
   queryKey: [...contractKeys.all, 'total-count'] as const,
   queryFn: async () => {
      const { count, error } = await supabase
         .from('CONTRACT_SERVICII')
         .select('*', { count: 'exact', head: true })
      if (error) throw new Error(error.message)
      return count ?? 0
   },
   meta: {
      errorMessage: 'Nu am putut prelua numarul total de contracte.',
   }
})

export const contractListOptions = (filters: ContractListFilter) =>
   queryOptions({
      queryKey: contractKeys.list(filters),
      queryFn: () => getContracts(filters),
      placeholderData: keepPreviousData,
      meta: {
         errorMessage: 'Nu am putut prelua lista de contracte.',
      },
   })

export const clientSearchOptions = (term: string) =>
   queryOptions({
      queryKey: clientKeys.search(term),
      queryFn: () => searchClients(term),
      enabled: term.length >= 2,
      staleTime: 30_000,
   })

export const contabilSearchOptions = (term: string) =>
   queryOptions({
      queryKey: accountantKeys.search(term),
      queryFn: () => searchAccountants(term),
      enabled: term.length >= 2,
      staleTime: 30_000,
   })
