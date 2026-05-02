import { Users, UserCheck, FileText, Wallet, UserPlus, Calculator } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { clientCountOptions } from '@/shared/api/clients/queries'
import { accountantCountOptions } from '@/shared/api/accountants/queries'
import { contractCountOptions } from '@/shared/contracts/queries'
import { PaymentStatsSection } from '@/features/payments/components/PaymentStatsSection'

export function DashboardPage() {
  const navigate = useNavigate()

  const { data: clientsCount = 0, isLoading: isLoadingClientsCount } = useQuery(clientCountOptions)
  const { data: accountantsCount = 0, isLoading: isLoadingAccountantsCount } = useQuery(accountantCountOptions)
  const { data: activeContractsCount = 0, isLoading: isLoadingContractsCount } = useQuery(contractCountOptions)

  if (isLoadingClientsCount || isLoadingAccountantsCount || isLoadingContractsCount) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Dashboard"
        description="Privire de ansamblu asupra platformei."
      />

      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Statistici</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Clienți totali" value={clientsCount} icon={Users} />
          <StatCard label="Contabili" value={accountantsCount} icon={UserCheck} />
          <StatCard label="Contracte active" value={activeContractsCount} icon={FileText} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Acțiuni rapide</p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/payments', search: { add: true } })}
          >
            <Wallet className="size-4" />
            Plată nouă
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/users', search: { tab: 'clients', add: true } })}
          >
            <UserPlus className="size-4" />
            Client nou
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/users', search: { tab: 'accountants', add: true } })}
          >
            <Calculator className="size-4" />
            Contabil nou
          </Button>
        </div>
      </div>

      <PaymentStatsSection />
    </div>
  )
}
