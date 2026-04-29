import { Users, UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { ClientsTab } from './ClientsTab'
import { AccountantsTab } from './AccountantsTab'
import { cn } from '@/lib/utils'
import { clientCountOptions } from '@/shared/api/clients/queries'
import { accountantCountOptions } from '@/shared/api/accountants/queries'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_layout/users'

type Tab = 'clients' | 'accountants'

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'clients', label: 'Clienți', icon: Users },
  { id: 'accountants', label: 'Contabili', icon: UserCheck },
]


export function UsersPage() {
  const { tab: activeTab } = Route.useSearch()
  const navigate = useNavigate()
  const { 
    data: clientsCount = 0,
    isLoading: isLoadingClientsCount,
  } = useQuery(clientCountOptions);

  const {
    data: accountantsCount = 0,
    isLoading: isLoadingAccountantsCount,
  } = useQuery(accountantCountOptions);

  if (isLoadingClientsCount || isLoadingAccountantsCount) {
    // TODO: Componenta de loading, si mai tarziu pus totul sub un skeleton
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Utilizatori"
        description="Gestionează conturile de clienți și contabili."
      />

      <div className="flex gap-1 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => {
          const count = id === 'clients' ? clientsCount : accountantsCount
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => navigate({ to: '/users', search: { tab: id } })}
              className={cn(
                'shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {label}
              <span className={cn(
                'rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {activeTab === 'clients' && <ClientsTab />}
      {activeTab === 'accountants' && <AccountantsTab />}
    </div>
  )
}
