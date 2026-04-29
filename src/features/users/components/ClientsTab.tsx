import { useState } from 'react'
import { Building2, Mail, CalendarDays, Plus } from 'lucide-react'
import { EditClientModal } from './EditClientModal'
import { CreateClientModal } from './CreateClientModal'
import { SearchInput } from '@/components/ui/search-input'
import { Pagination } from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserRowActions } from './UserRowActions'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['CLIENT']['Row']

const MOCK_CLIENTS = [
  {
    id: 1, user_id: 'uid-client-1', denumire: 'Alfa SRL', cif: 'RO12345678',
    tip_firma: 'SRL', email: 'contact@alfa.ro', telefon: '0721000001',
    adresa: 'Str. Exemplu nr. 1', localitate: 'București', judet: 'Ilfov',
    created_at: '2024-01-15T10:00:00Z', tip_impozitare: 'micro',
    perioada_fiscala: 'lunar', este_platitor_tva: true, are_salariati: true,
    banca: 'BCR', iban: 'RO12BCR0000000000000001', nr_reg_com: 'J40/1234/2024', cod_judet: 'IF',
  },
  {
    id: 2, user_id: 'uid-client-2', denumire: 'Beta PFA', cif: 'RO87654321',
    tip_firma: 'PFA', email: 'beta.pfa@exemplu.ro', telefon: '0722000002',
    adresa: 'Str. Test nr. 2', localitate: 'Cluj-Napoca', judet: 'Cluj',
    created_at: '2024-03-10T08:00:00Z', tip_impozitare: 'micro',
    perioada_fiscala: 'trimestrial', este_platitor_tva: false, are_salariati: false,
    banca: 'BT', iban: 'RO12BT0000000000000002', nr_reg_com: null, cod_judet: 'CJ',
  },
  {
    id: 3, user_id: null, denumire: 'Gamma SA', cif: 'RO11111111',
    tip_firma: 'SA', email: null, telefon: null,
    adresa: null, localitate: 'Timișoara', judet: 'Timiș',
    created_at: '2024-06-01T12:00:00Z', tip_impozitare: 'profit',
    perioada_fiscala: 'lunar', este_platitor_tva: true, are_salariati: true,
    banca: null, iban: null, nr_reg_com: 'J35/100/2024', cod_judet: 'TM',
  },
] as unknown as Client[]

const ACTIVE_CLIENT_IDS = new Set(['uid-client-1'])
const PAGE_SIZE = 25

export function ClientsTab() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(0)
  }

  const effectiveSearch = search.trim().length >= 2 ? search.trim().toLowerCase() : ''

  const filtered = effectiveSearch
    ? MOCK_CLIENTS.filter(c =>
        c.denumire.toLowerCase().includes(effectiveSearch) ||
        c.cif.toLowerCase().includes(effectiveSearch) ||
        (c.email?.toLowerCase().includes(effectiveSearch) ?? false)
      )
    : MOCK_CLIENTS

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Caută după denumire, CIF sau email..."
          className="w-full sm:max-w-sm"
        />
        <Button onClick={() => setShowCreate(true)} className="sm:ml-auto gap-1.5 shrink-0">
          <Plus className="size-4" />
          Client nou
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              {effectiveSearch ? 'Niciun client găsit pentru această căutare.' : 'Niciun client înregistrat.'}
            </div>
          ) : (
            filtered.map(client => (
              <div key={client.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors group">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="size-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start sm:items-center w-full">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{client.denumire}</p>
                    <p className="text-xs text-muted-foreground">{client.cif} · {client.tip_firma}</p>
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    {client.email ? (
                      <>
                        <Mail className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{client.email}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">fără email</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5 shrink-0" />
                    <span className="truncate">
                      Creat la {new Date(client.created_at).toLocaleDateString('ro-RO')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={client.user_id ? 'success' : 'outline'}>
                      {client.user_id ? 'Cont activ' : 'Fără cont'}
                    </Badge>
                    <Badge
                      variant={client.user_id && ACTIVE_CLIENT_IDS.has(client.user_id) ? 'success' : 'outline'}
                    >
                      {client.user_id && ACTIVE_CLIENT_IDS.has(client.user_id) ? 'Contract activ' : 'Fără contract activ'}
                    </Badge>
                  </div>
                </div>

                <UserRowActions
                  onEdit={() => setEditingClient(client)}
                  email={client.email}
                  displayName={client.denumire}
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

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}

      {showCreate && <CreateClientModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
