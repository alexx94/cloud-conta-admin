import { supabase } from "@/lib/supabase";

export const getContractsCounts = async () => {
   const { count, error } = await supabase
      .from('CONTRACT_SERVICII')
      .select('*', { count: 'exact', head: true })
      .eq('este_activ', true);

   if (error) throw new Error(error.message);
   return count ?? 0;
}
