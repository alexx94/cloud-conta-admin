import { Users, UserCheck, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { clientCountOptions } from '@/shared/api/clients/queries'
import { useQuery } from '@tanstack/react-query'

function formatRON(amount: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(amount)
}

const mockStats = {
  clientsCount: 3,
  accountantsCount: 2,
  activeContractsCount: 2,
  totalIncasat: 700,
  totalNeincasat: 500,
  totalDepasit: 300,
}

export function DashboardPage() {
  const { 
    data: clientsCount,
    isLoading: isLoadingClientsCount,
  } = useQuery(clientCountOptions);

  if (isLoadingClientsCount) {
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
          value={mockStats.accountantsCount}
          icon={UserCheck}
        />
        <StatCard
          label="Contracte active"
          value={mockStats.activeContractsCount}
          icon={FileText}
        />
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Situație plăți</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total încasat"
            value={formatRON(mockStats.totalIncasat)}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            label="De încasat"
            value={formatRON(mockStats.totalNeincasat)}
            icon={TrendingUp}
            variant="warning"
          />
          <StatCard
            label="Scadență depășită"
            value={formatRON(mockStats.totalDepasit)}
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>
      </div>
    </div>
  )
}
