import { mutationOptions } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PaymentUpdatePatch, PaymentCreateInput } from '@/features/payments/types'

export const updatePayment = async (id: number, patch: PaymentUpdatePatch) => {
  const { error } = await supabase.from('PLATA').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export const deletePayment = async (id: number) => {
  const { error } = await supabase.from('PLATA').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export const createPayment = async (input: PaymentCreateInput) => {
  const { error } = await supabase.from('PLATA').insert(input)
  if (error) throw new Error(error.message)
}

export const updatePaymentOptions = (id: number) =>
  mutationOptions({
    mutationFn: (patch: PaymentUpdatePatch) => updatePayment(id, patch),
    meta: { errorMessage: 'Nu am putut actualiza plata.' },
  })

export const createPaymentOptions = mutationOptions({
  mutationFn: (input: PaymentCreateInput) => createPayment(input),
  meta: { errorMessage: 'Nu am putut crea plata.' },
})

export const deletePaymentOptions = mutationOptions({
  mutationFn: (id: number) => deletePayment(id),
  meta: { errorMessage: 'Nu am putut șterge plata.' },
})
