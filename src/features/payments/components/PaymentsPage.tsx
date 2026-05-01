import { PageHeader } from '@/components/ui/page-header'
import { PaymentStatsSection } from './PaymentStatsSection'
import { PaymentsTable } from './PaymentsTable'

export function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plăți"
        description="Situația financiară a tuturor contractelor."
      />
      <PaymentStatsSection />
      <PaymentsTable />
    </div>
  )
}
