import { queryOptions } from "@tanstack/react-query";
import { getContractsCounts } from "./api";

export const contractKeys = {
   all: ['contracts'] as const,
   counts: () => [...contractKeys.all, 'count'] as const,
};

export const contractCountOptions = queryOptions({
   queryKey: contractKeys.counts(),
   queryFn: getContractsCounts,
   meta: {
      errorMessage: 'Nu am putut prelua numarul de contracte active de la server.',
   }
})
