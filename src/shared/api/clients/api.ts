import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type ClientUpdatePatch = Pick<
   Database['public']['Tables']['CLIENT']['Update'],
   'cif' | 'denumire' | 'email' | 'telefon' | 'adresa' | 'localitate' | 'judet' | 'cod_judet' | 'nr_reg_com' |
   'tip_firma' | 'tip_impozitare' | 'perioada_fiscala' |
   'este_platitor_tva' | 'are_salariati' | 'banca' | 'iban' | 'modified_at'
>

export const updateClient = async (id: number, patch: ClientUpdatePatch) => {
   const { error } = await supabase.from('CLIENT').update(patch).eq('id', id)
   if (error) throw new Error(error.message)
}

export const getClientsCounts = async () => {
   const { count, error } = await supabase
      .from('CLIENT')
      .select('*', { count: 'exact', head: true });

   if (error) throw new Error(error.message);
   return count ?? 0;
}

export const searchClients = async (term: string) => {
   const { data, error } = await supabase
      .from('CLIENT')
      .select('id, denumire, cif, user_id')
      .ilike('denumire', `%${term}%`)
      .order('denumire', { ascending: true })
      .limit(6)
   if (error) throw new Error(error.message)
   return data ?? []
}