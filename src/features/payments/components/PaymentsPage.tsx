import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { PaymentStatsSection } from './PaymentStatsSection'
import { PaymentsTable } from './PaymentsTable'
import { AddPaymentModal } from './AddPaymentModal'
import { Route } from '@/routes/_layout/payments'

export function PaymentsPage() {
  const { add } = Route.useSearch()
  const [showAdd, setShowAdd] = useState(() => add === true)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plăți"
        description="Situația financiară a tuturor contractelor."
        action={
          <Button onClick={() => setShowAdd(true)} className="gap-1.5">
            <Plus className="size-4" />
            Plată nouă
          </Button>
        }
      />
      <PaymentStatsSection />
      <PaymentsTable />
      {showAdd && <AddPaymentModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
