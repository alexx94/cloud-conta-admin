import { useState } from 'react'
import { Plus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { EditClientModal } from './EditClientModal'
import { CreateClientModal } from './CreateClientModal'
import { SearchInput } from '@/components/ui/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { clientListOptions } from '../queries/clients'
import { getClientsLastCursor, PAGE_SIZE } from '../api/clients'
import { clientCountOptions } from '@/shared/api/clients/queries'
import { useDebounce } from '@/hooks/useDebounce'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['CLIENT']['Row']

export function ClientsTab() {
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState<number | undefined>(undefined)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isFetching } = useQuery(
    clientListOptions({ cursor, direction, search: debouncedSearch })
  )
  const { data: totalCount = 0 } = useQuery(clientCountOptions)

  const items = data?.items ?? []
  const hasMore = data?.hasMore ?? false

  const hasData = data !== undefined
  const isFirstPage = direction === 'forward' ? cursor === undefined : (hasData && !hasMore)
  const isLastPage = direction === 'backward' ? cursor === undefined : (hasData && !hasMore)
  const canGoPrev = !isFirstPage
  const canGoNext = !isLastPage

  function handleSearch(value: string) {
    setSearch(value)
    setCursor(undefined)
    setDirection('forward')
  }

  function goFirst() {
    setCursor(undefined)
    setDirection('forward')
  }

  function goNext() {
    setCursor(items.at(-1)?.id)
    setDirection('forward')
  }

  function goPrev() {
    setCursor(items[0]?.id)
    setDirection('backward')
  }

  async function goLast() {
    const lastCursor = await getClientsLastCursor(totalCount, PAGE_SIZE)
    setCursor(lastCursor)
    setDirection('forward')
  }

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

      <div className={`bg-card border border-border rounded-xl overflow-hidden transition-opacity ${isFetching ? 'opacity-60' : ''}`}>

        {/* Mobile: carduri */}
        <div className="md:hidden divide-y divide-border">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {debouncedSearch ? 'Niciun client găsit pentru această căutare.' : 'Niciun client înregistrat.'}
            </div>
          ) : (
            items.map(client => (
              <div
                key={client.id}
                onClick={() => setSelectedId(client.id === selectedId ? null : client.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/40 ${
                  selectedId === client.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{client.denumire}</p>
                  <p className="text-xs text-muted-foreground">{client.cif} · {client.tip_firma}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={client.user_id ? 'success' : 'outline'}>
                      {client.user_id ? 'Cont activ' : 'Fără cont'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => { e.stopPropagation(); setEditingClient(client) }}
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Desktop: tabel */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-[35%]">Denumire / CIF</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden lg:table-cell">Localitate</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden xl:table-cell">Creat la</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-28">Statut</th>
                <th className="px-4 py-2.5 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                    {debouncedSearch ? 'Niciun client găsit pentru această căutare.' : 'Niciun client înregistrat.'}
                  </td>
                </tr>
              ) : (
                items.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedId(client.id === selectedId ? null : client.id)}
                    className={`cursor-pointer transition-colors hover:bg-muted/40 ${
                      selectedId === client.id ? 'bg-primary/5 hover:bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate">{client.denumire}</p>
                      <p className="text-xs text-muted-foreground">{client.cif} · {client.tip_firma}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-45">
                      {client.email ?? <span className="italic">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {client.localitate ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={client.user_id ? 'success' : 'outline'}>
                        {client.user_id ? 'Cont activ' : 'Fără cont'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setEditingClient(client)}>
                        <Pencil className="size-3.5" />
                        Editează
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-border">
          <Button variant="outline" size="sm" disabled={isFirstPage || isFetching} onClick={goFirst}>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={!canGoPrev || isFetching} onClick={goPrev}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={!canGoNext || isFetching} onClick={goNext}>
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={isLastPage || isFetching || !!debouncedSearch} onClick={goLast}>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
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
