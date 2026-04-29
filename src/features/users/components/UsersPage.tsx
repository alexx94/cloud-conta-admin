import { useState } from 'react'
import { Users, UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { ClientsTab } from './ClientsTab'
import { AccountantsTab } from './AccountantsTab'
import { cn } from '@/lib/utils'

type Tab = 'clients' | 'accountants'

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'clients', label: 'Clienți', icon: Users },
  { id: 'accountants', label: 'Contabili', icon: UserCheck },
]

const clientsCount = 3
const accountantsCount = 2

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('clients')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Utilizatori"
        description="Gestionează conturile de clienți și contabili."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total clienți</p>
          <p className="text-2xl font-bold text-foreground">{clientsCount}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total contabili</p>
          <p className="text-2xl font-bold text-foreground">{accountantsCount}</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'clients' && <ClientsTab />}
      {activeTab === 'accountants' && <AccountantsTab />}
    </div>
  )
}
