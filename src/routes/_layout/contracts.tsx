import { createFileRoute } from '@tanstack/react-router'
import { ContractsPage } from '@/features/contracts/components/ContractsPage'

export const Route = createFileRoute('/_layout/contracts')({
  component: ContractsPage,
})
