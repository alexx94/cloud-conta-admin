import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { authQueryOptions } from '@/features/auth/queries/useAuth'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.fetchQuery(authQueryOptions)
    if (auth.isAdmin) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
