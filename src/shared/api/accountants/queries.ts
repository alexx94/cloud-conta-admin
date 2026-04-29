import { queryOptions } from "@tanstack/react-query";
import { getAccountantsCounts } from "./api";

export type AccountantListFilter = {
   cursor: number | undefined
   direction: 'forward' | 'backward'
   search: string
}

export const accountantKeys = {
   all: ['accountants'] as const,
   counts: () => [...accountantKeys.all, 'count'] as const,
   lists: () => [...accountantKeys.all, 'list'] as const,
   list: (filters: AccountantListFilter) => [...accountantKeys.lists(), filters] as const,
};

export const accountantCountOptions = queryOptions({
   queryKey: accountantKeys.counts(),
   queryFn: getAccountantsCounts,
   // am default value in src/app/query-client.ts = 5 minute

   meta: {
      errorMessage: 'Nu am putut prelua numarul de contabili de la server.',
   }
})
