import { mutationOptions } from "@tanstack/react-query";
import { updateAccountant, type AccountantUpdatePatch } from "@/shared/api/accountants/api";

export const updateAccountantOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: AccountantUpdatePatch) => updateAccountant(id, patch),
      meta: {
         errorMessage: 'Nu am putut actualiza datele contabilului.',
      },
   })
