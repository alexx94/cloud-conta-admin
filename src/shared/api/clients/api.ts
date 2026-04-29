import { supabase } from "@/lib/supabase";

export const getClientsCounts = async () => {
   const { count, error } = await supabase
      .from('CLIENT')
      .select('*', { count: 'exact', head: true });

   if (error) throw new Error(error.message);
   return count ?? 0;
}