import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { accountantKeys, type AccountantListFilter } from "@/shared/api/accountants/queries";
import { getAccountants } from "../api/accountants";

export const accountantListOptions = (filters: AccountantListFilter) =>
   queryOptions({
      queryKey: accountantKeys.list(filters),
      queryFn: () => getAccountants(filters),
      placeholderData: keepPreviousData,
      meta: {
         errorMessage: 'Nu am putut prelua lista de contabili.',
      },
   })
