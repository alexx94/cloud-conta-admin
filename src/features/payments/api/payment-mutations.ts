import { supabase } from '@/lib/supabase'
import type { PaymentUpdatePatch } from '@/features/payments/types'

export const updatePayment = async (id: number, patch: PaymentUpdatePatch) => {
  const { error } = await supabase.from('PLATA').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export const deletePayment = async (id: number) => {
  const { error } = await supabase.from('PLATA').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
