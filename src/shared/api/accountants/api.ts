import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type AccountantUpdatePatch = Pick<
   Database['public']['Tables']['CONTABIL']['Update'],
   'denumire' | 'email' | 'modified_at'
>

export const getAccountantsCounts = async () => {
   const { count, error } = await supabase
      .from('CONTABIL')
      .select('*', { count: 'exact', head: true });

   if (error) throw new Error(error.message);
   return count ?? 0;
}

export const updateAccountant = async (id: number, patch: AccountantUpdatePatch) => {
   const { error } = await supabase
      .from('CONTABIL')
      .update(patch)
      .eq('id', id);

   if (error) throw new Error(error.message);
}

export const searchAccountants = async (term: string) => {
   const { data, error } = await supabase
      .from('CONTABIL')
      .select('id, denumire, email')
      .ilike('denumire', `%${term}%`)
      .order('denumire', { ascending: true })
      .limit(6)

   if (error) throw new Error(error.message)
   return data ?? []
}