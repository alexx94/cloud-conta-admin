import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { accountantKeys, type AccountantListFilter } from "@/shared/api/accountants/queries";
import { getAccountants } from "../api/accountants";
import { searchAccountants } from "@/shared/api/accountants/api";

export const accountantListOptions = (filters: AccountantListFilter) =>
   queryOptions({
      queryKey: accountantKeys.list(filters),
      queryFn: () => getAccountants(filters),
      placeholderData: keepPreviousData,
      meta: {
         errorMessage: 'Nu am putut prelua lista de contabili.',
      },
   })

export const accountantSearchOptions = (term: string) =>
   queryOptions({
      queryKey: accountantKeys.search(term),
      queryFn: () => searchAccountants(term),
      enabled: term.length >= 2,
      staleTime: 30_000,
   })
