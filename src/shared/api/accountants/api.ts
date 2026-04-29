import { supabase } from "@/lib/supabase";

export const getAccountantsCounts = async () => {
   const { count, error } = await supabase
      .from('CONTABIL')
      .select('*', { count: 'exact', head: true });

   if (error) throw new Error(error.message);
   return count ?? 0;
}