import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/app/query-client'

export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      queryClient.clear()
      navigate({ to: '/login' })
    },
  })
}
