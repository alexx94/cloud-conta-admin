import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { authQueryOptions } from '@/features/auth/queries/useAuth' 
import { AppLayout } from '@/components/layout/AppLayout'
import { supabase } from '@/lib/supabase'
import { Toaster } from '@/components/ui/sonner'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.fetchQuery(authQueryOptions)
    if (!auth.user) {
      throw redirect({ to: '/login' })
    }
    if (!auth.isAdmin) {
      await supabase.auth.signOut()
      context.queryClient.clear()
      throw redirect({ to: '/login', search: { error: 'unauthorized' } })
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
      <Toaster richColors position='top-right'/>
    </AppLayout>
  ),
})
