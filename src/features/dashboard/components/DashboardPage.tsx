import { Users, UserCheck, FileText } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { clientCountOptions } from '@/shared/api/clients/queries'
import { useQuery } from '@tanstack/react-query'
import { accountantCountOptions } from '@/shared/api/accountants/queries'
import { contractCountOptions } from '@/shared/contracts/queries'
import { PaymentStatsSection } from '@/features/payments/components/PaymentStatsSection'

export function DashboardPage() {
  const {
    data: clientsCount = 0,
    isLoading: isLoadingClientsCount,
  } = useQuery(clientCountOptions);

  const {
    data: accountantsCount = 0,
    isLoading: isLoadingAccountantsCount,
  } = useQuery(accountantCountOptions);

  const {
    data: activeContractsCount = 0,
    isLoading: isLoadingContractsCount,
  } = useQuery(contractCountOptions);

  if (isLoadingClientsCount || isLoadingAccountantsCount || isLoadingContractsCount) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Privire de ansamblu asupra platformei."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Clienți totali"
          value={clientsCount}
          icon={Users}
        />
        <StatCard
          label="Contabili"
          value={accountantsCount}
          icon={UserCheck}
        />
        <StatCard
          label="Contracte active"
          value={activeContractsCount}
          icon={FileText}
        />
      </div>

      <PaymentStatsSection />
    </div>
  )
}
