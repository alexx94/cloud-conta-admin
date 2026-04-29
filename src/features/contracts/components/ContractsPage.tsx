import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ContractRow } from './ContractRow'
import { CreateContractModal } from './CreateContractModal'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type ContractRowType = Database['public']['Tables']['CONTRACT_SERVICII']['Row']
type ContractFilter = 'all' | 'active' | 'inactive'

const filters: { id: ContractFilter; label: string }[] = [
  { id: 'all', label: 'Toate' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
]

const MOCK_CONTRACTS = [
  {
    id: 1, client_uid: 'uid-client-1', contabil_uid: 'uid-acc-1',
    tarif_lunar: 500, moneda: 'RON', data_inceput: '2024-01-15',
    data_sfarsit: null, este_activ: true, motiv_incetare: null,
  },
  {
    id: 2, client_uid: 'uid-client-2', contabil_uid: 'uid-acc-2',
    tarif_lunar: 300, moneda: 'RON', data_inceput: '2024-03-10',
    data_sfarsit: null, este_activ: true, motiv_incetare: null,
  },
  {
    id: 3, client_uid: 'uid-client-1', contabil_uid: 'uid-acc-1',
    tarif_lunar: 800, moneda: 'EUR', data_inceput: '2023-06-01',
    data_sfarsit: '2024-01-10', este_activ: false, motiv_incetare: 'reziliere_client',
  },
] as unknown as ContractRowType[]

export function ContractsPage() {
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<ContractFilter>('all')
  const [showCreate, setShowCreate] = useState(false)

  const contracts = MOCK_CONTRACTS.filter(c => {
    if (filter === 'active') return c.este_activ
    if (filter === 'inactive') return !c.este_activ
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contracte"
        description="Gestionează relațiile client–contabil și tarifele."
        action={
          <Button onClick={() => setShowCreate(true)} className="gap-1.5">
            <Plus className="size-4" />
            Contract nou
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap gap-1 px-4 py-3 border-b border-border bg-muted/30">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setPage(0) }}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground self-center">
            {contracts.length} {contracts.length === 1 ? 'contract' : 'contracte'}
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            Niciun contract pentru filtrul selectat.
          </div>
        ) : (
          <div>
            {contracts.map(contract => (
              <ContractRow
                key={contract.id}
                contract={contract}
              />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageCount={1}
          total={contracts.length}
          pageSize={25}
          onPageChange={setPage}
        />
      </div>

      {showCreate && <CreateContractModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
