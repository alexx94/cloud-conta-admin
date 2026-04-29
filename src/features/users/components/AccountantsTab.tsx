import { useState } from 'react'
import { UserCheck, Mail, CalendarDays } from 'lucide-react'
import { EditAccountantModal } from './EditAccountantModal'
import { SearchInput } from '@/components/ui/search-input'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { UserRowActions } from './UserRowActions'
import type { Database } from '@/types/database'

type Accountant = Database['public']['Tables']['CONTABIL']['Row']

const MOCK_ACCOUNTANTS = [
  {
    id: 1, user_id: 'uid-acc-1', denumire: 'Ion Popescu Contabilitate',
    email: 'ion.popescu@contabil.ro', created_at: '2023-09-01T09:00:00Z',
  },
  {
    id: 2, user_id: 'uid-acc-2', denumire: 'Maria Ionescu Expert',
    email: 'maria.ionescu@expert.ro', created_at: '2024-02-20T11:00:00Z',
  },
] as unknown as Accountant[]

const ACTIVE_ACCOUNTANT_IDS = new Set(['uid-acc-1', 'uid-acc-2'])
const PAGE_SIZE = 25

export function AccountantsTab() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [editingAccountant, setEditingAccountant] = useState<Accountant | null>(null)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(0)
  }

  const effectiveSearch = search.trim().length >= 2 ? search.trim().toLowerCase() : ''

  const filtered = effectiveSearch
    ? MOCK_ACCOUNTANTS.filter(a =>
        a.denumire.toLowerCase().includes(effectiveSearch) ||
        (a.email?.toLowerCase().includes(effectiveSearch) ?? false)
      )
    : MOCK_ACCOUNTANTS

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Caută după denumire sau email..."
          className="w-full sm:max-w-sm"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              {effectiveSearch ? 'Niciun contabil găsit pentru această căutare.' : 'Niciun contabil înregistrat.'}
            </div>
          ) : (
            filtered.map(accountant => (
              <div key={accountant.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors group">
                <div className="size-9 rounded-lg bg-chart-2/10 flex items-center justify-center shrink-0">
                  <UserCheck className="size-4 text-chart-2" />
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3 items-center w-full">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{accountant.denumire}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <CalendarDays className="size-3.5 shrink-0" />
                      <span>Înregistrat {new Date(accountant.created_at).toLocaleDateString('ro-RO')}</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    {accountant.email ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{accountant.email}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">fără email</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={accountant.user_id ? 'success' : 'outline'}>
                      {accountant.user_id ? 'Cont activ' : 'Fără cont'}
                    </Badge>
                    <Badge
                      variant={accountant.user_id && ACTIVE_ACCOUNTANT_IDS.has(accountant.user_id) ? 'success' : 'outline'}
                    >
                      {accountant.user_id && ACTIVE_ACCOUNTANT_IDS.has(accountant.user_id)
                        ? 'Contracte active'
                        : 'Fără contracte'}
                    </Badge>
                  </div>
                </div>

                <UserRowActions
                  onEdit={() => setEditingAccountant(accountant)}
                  email={accountant.email}
                  displayName={accountant.denumire}
                />
              </div>
            ))
          )}
        </div>

        <Pagination
          page={page}
          pageCount={1}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {editingAccountant && (
        <EditAccountantModal
          accountant={editingAccountant}
          onClose={() => setEditingAccountant(null)}
        />
      )}
    </div>
  )
}
