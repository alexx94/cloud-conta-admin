import { Users, UserCheck, FileText, Wallet, UserPlus, Calculator } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
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
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Acțiuni rapide</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate({ to: '/payments', search: { add: true } })}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 sm:p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
            <div className="relative flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-4">
              <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                <Wallet className="size-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white">Plată nouă</p>
                <p className="text-xs text-emerald-100/80 hidden sm:block">Înregistrează o plată</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate({ to: '/users', search: { tab: 'clients', add: true } })}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 sm:p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
            <div className="relative flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-4">
              <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                <UserPlus className="size-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white">Client nou</p>
                <p className="text-xs text-blue-100/80 hidden sm:block">Adaugă un client</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate({ to: '/users', search: { tab: 'accountants', add: true } })}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-4 sm:p-6 text-left shadow-md transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
            <div className="relative flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-4">
              <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                <Calculator className="size-5" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-white">Contabil nou</p>
                <p className="text-xs text-violet-100/80 hidden sm:block">Adaugă un contabil</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Statistici</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Clienți totali" value={clientsCount} icon={Users} />
          <StatCard label="Contabili" value={accountantsCount} icon={UserCheck} />
          <StatCard label="Contracte active" value={activeContractsCount} icon={FileText} />
        </div>
      </div>

      <PaymentStatsSection />
    </div>
  )
}
