import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { clientKeys, type ClientListFilter } from "@/shared/api/clients/queries";
import { getClients } from "../api/clients";

export const clientListOptions = (filters: ClientListFilter) =>
   queryOptions({
      queryKey: clientKeys.list(filters),
      queryFn: () => getClients(filters),
      placeholderData: keepPreviousData,
      meta: {
         errorMessage: 'Nu am putut prelua lista de clienți.',
      },
   })
