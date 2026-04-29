import { queryOptions } from "@tanstack/react-query";
import { getClientsCounts } from "./api";

export const clientKeys = {
   all: ['clients'] as const,
   counts: () => [...clientKeys.all, 'count'] as const,
};

export const clientCountOptions = queryOptions({
   queryKey: clientKeys.counts(),
   queryFn: getClientsCounts,
   // am default value in src/app/query-client.ts = 5 minute

   // TODO: Erorile pot fi prinse global, modularizate erorile in functie de cod - mesaj eroare,
   //       astfel incat sa devina si mai abstract, mai curat totul si scalabil pe termen lung
   meta: {
      errorMessage: 'Nu am putut prelua numarul de clienti de la server.',
   }
})
