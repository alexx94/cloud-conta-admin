import { supabase } from "@/lib/supabase";
import type { AccountantListFilter } from "@/shared/api/accountants/queries";

export const PAGE_SIZE = 25

type GetAccountantsParams = AccountantListFilter & { pageSize?: number }

export const getAccountantsLastCursor = async (total: number, pageSize: number = PAGE_SIZE) => {
   const lastPageSize = total % pageSize || pageSize
   const cursorIndex = total - lastPageSize - 1
   if (cursorIndex < 0) return undefined

   const { data, error } = await supabase
      .from('CONTABIL')
      .select('id')
      .order('id', { ascending: true })
      .range(cursorIndex, cursorIndex)

   if (error) throw new Error(error.message)
   return data?.[0]?.id as number | undefined
}

export const getAccountants = async ({ cursor, direction, search, pageSize = PAGE_SIZE }: GetAccountantsParams) => {
   let query = supabase
      .from('CONTABIL')
      .select('*')
      .limit(pageSize + 1)

   if (direction === 'forward') {
      query = query.order('id', { ascending: true })
      if (cursor !== undefined) query = query.gt('id', cursor)
   } else {
      query = query.order('id', { ascending: false })
      if (cursor !== undefined) query = query.lt('id', cursor)
   }

   if (search.trim()) {
      query = query.or(`denumire.ilike.%${search}%,email.ilike.%${search}%`)
   }

   const { data, error } = await query
   if (error) throw new Error(error.message)

   const raw = data ?? []
   const hasMore = raw.length > pageSize
   const items = raw.slice(0, pageSize)

   return {
      items: direction === 'backward' ? [...items].reverse() : items,
      hasMore,
   }
}
