import { mutationOptions } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type AnafResult = {
  cod_fiscal: string
  denumire: string
  adresa: string
  judet: string
  cod_judet: string | null
  localitate: string
  cod_postal: string | null
  nr_reg_com: string | null
  telefon: string | null
  este_platitor_tva: boolean
  status_ro_efactura: boolean
}

const anafLookup = async (cif: string): Promise<AnafResult> => {
  const { data, error } = await supabase.functions.invoke(
    `anaf-lookup?cif=${encodeURIComponent(cif)}`,
    { method: 'GET' }
  )
  if (error) throw new Error(error.message)
  if (data?.error) throw new Error(data.error)
  return data as AnafResult
}

export const anafLookupOptions = mutationOptions({
  mutationFn: (cif: string) => anafLookup(cif),
  meta: {
    errorMessage: 'Nu am putut prelua datele de la ANAF.',
  },
})
