import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users/components/UsersPage'
import { z } from 'zod'

export const Route = createFileRoute('/_layout/users')({
  validateSearch: z.object({
    tab: z.enum(['clients', 'accountants']).default('clients'),
  }),
  component: UsersPage,
})
