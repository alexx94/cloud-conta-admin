import { mutationOptions } from "@tanstack/react-query";
import { updateAccountant, type AccountantUpdatePatch } from "@/shared/api/accountants/api";
import { supabase } from "@/lib/supabase";

export const updateAccountantOptions = (id: number) =>
   mutationOptions({
      mutationFn: (patch: AccountantUpdatePatch) => updateAccountant(id, patch),
      meta: {
         errorMessage: 'Nu am putut actualiza datele contabilului.',
      },
   })

export type CreateAccountantInput = {
  denumire: string
  email: string
  password: string
}

export type CreateAccountantResult = { contabilId: number; userId: string }

const createAccountantFn = async (input: CreateAccountantInput): Promise<CreateAccountantResult> => {
  const { data, error } = await supabase.functions.invoke('create-contabil', { body: input })
  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: { error?: string } | null = await (error as any).context?.json?.().catch(() => null)
    throw new Error(body?.error ?? error.message)
  }
  return data as CreateAccountantResult
}

export const createAccountantOptions = mutationOptions({
  mutationFn: createAccountantFn,
  meta: { errorMessage: 'Nu am putut crea contabilul.' },
})

