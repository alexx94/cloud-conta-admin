import { queryOptions, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'

async function fetchAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { user: null, role: null, isAdmin: false }

  const { data: roleRow } = await supabase
    .from('USER_ROLES')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  return {
    user: session.user,
    role: roleRow?.role ?? null,
    isAdmin: roleRow?.role === 'admin',
  }
}

export const authQueryOptions = queryOptions({
  queryKey: queryKeys.auth,
  queryFn: fetchAuth,
  staleTime: 1000 * 60 * 5,
})

export function useAuth() {
  return useQuery(authQueryOptions)
}
