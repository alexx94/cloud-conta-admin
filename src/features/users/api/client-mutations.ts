import { mutationOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { updateClient, type ClientUpdatePatch } from "@/shared/api/clients/api";
import type { Database } from "@/types/database";

type TipFirma = Database['public']['Enums']['tip_firma_enum']
type TipImpozitare = Database['public']['Enums']['tip_impozitare_enum']
type PerioadaFiscala = Database['public']['Enums']['perioada_fiscala_enum']

export const updateClientOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: ClientUpdatePatch) => updateClient(id, patch),
      meta: {
         errorMessage: 'Nu am putut actualiza datele clientului.',
      },
   })

export type CreateClientInput = {
  cif: string
  denumire: string
  tipFirma: TipFirma
  tipImpozitare: TipImpozitare
  perioadaFiscala: PerioadaFiscala
  estePlatitorTva: boolean
  areSalariati: boolean
  telefon: string | null
  adresa: string | null
  localitate: string | null
  judet: string | null
  codJudet: string | null
  nrRegCom: string | null
  email: string
  password: string
}

export type CreateClientResult = { clientId: number; userId: string }

const createClientFn = async (input: CreateClientInput): Promise<CreateClientResult> => {
  const { data, error } = await supabase.functions.invoke('create-client', { body: input })
  if (error) {
    // On non-2xx, Supabase stores the Response in error.context — parse the body for the specific message
    const body: { error?: string } | null = await (error as any).context?.json?.().catch(() => null)
    throw new Error(body?.error ?? error.message)
  }
  return data as CreateClientResult
}

export const createClientOptions = mutationOptions({
  mutationFn: createClientFn,
  meta: { errorMessage: 'Nu am putut crea clientul.' },
})
