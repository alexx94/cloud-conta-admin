import { createFileRoute } from '@tanstack/react-router'
import { PaymentsPage } from '@/features/payments/components/PaymentsPage'
import { z } from 'zod'

export const Route = createFileRoute('/_layout/payments')({
  validateSearch: z.object({
    add: z.boolean().optional(),
  }),
  component: PaymentsPage,
})
