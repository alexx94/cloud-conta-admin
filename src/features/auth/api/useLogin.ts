import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/app/query-client'

interface LoginCredentials {
  email: string
  password: string
}

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth'] })
      const auth = await queryClient.fetchQuery({
        queryKey: ['auth'],
        queryFn: async () => {
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
        },
      })

      if (!auth.isAdmin) {
        await supabase.auth.signOut()
        queryClient.clear()
        throw new Error('unauthorized')
      }

      navigate({ to: '/' })
    },
  })
}
