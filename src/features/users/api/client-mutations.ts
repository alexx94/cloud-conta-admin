import { mutationOptions } from "@tanstack/react-query";
import { updateClient, type ClientUpdatePatch } from "@/shared/api/clients/api";

export const updateClientOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: ClientUpdatePatch) => updateClient(id, patch),
      meta: {
         errorMessage: 'Nu am putut actualiza datele clientului.',
      },
   })
