import { useState } from 'react'
import { Plus, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
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

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
]

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
}

function DatePair({ created, modified }: { created: string; modified: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
        <span className="text-[10px] text-muted-foreground/50 w-9 shrink-0">creat</span>
        <span>{fmtDate(created)}</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[11px] tabular-nums">{fmtTime(created)}</span>
      </div>
      <div className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
        <span className="text-[10px] text-muted-foreground/50 w-9 shrink-0">modif.</span>
        <span>{fmtDate(modified)}</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="text-[11px] tabular-nums">{fmtTime(modified)}</span>
      </div>
    </div>
  )
}

export function ClientsTab() {
  const [search, setSearch] = useState('')
  const [cursor, setCursor] = useState<number | undefined>(undefined)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [selected, setSelected] = useState<Client | null>(null)
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
    setSelected(null)
  }

  function goFirst() {
    setCursor(undefined)
    setDirection('forward')
    setSelected(null)
  }

  function goNext() {
    setCursor(items.at(-1)?.id)
    setDirection('forward')
    setSelected(null)
  }

  function goPrev() {
    setCursor(items[0]?.id)
    setDirection('backward')
    setSelected(null)
  }

  async function goLast() {
    const lastCursor = await getClientsLastCursor(totalCount, PAGE_SIZE)
    setCursor(lastCursor)
    setDirection('forward')
    setSelected(null)
  }

  function toggleSelect(client: Client) {
    setSelected(prev => prev?.id === client.id ? null : client)
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
        <div className="flex items-center gap-2 sm:ml-auto shrink-0">
          <span
            className="hidden md:inline-flex"
            onClick={() => { if (!selected) toast.info('Selectează un rând din tabel mai întâi.') }}
          >
            <Button
              variant="outline"
              disabled={!selected}
              onClick={() => selected && setEditingClient(selected)}
              className="gap-1.5"
            >
              <Pencil className="size-3.5" />
              Editează
            </Button>
          </span>
          <Button onClick={() => setShowCreate(true)} className="gap-1.5">
            <Plus className="size-4" />
            Client nou
          </Button>
        </div>
      </div>

      <div className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-opacity ${isFetching ? 'opacity-60' : ''}`}>

        {/* Mobile: carduri */}
        <div className="md:hidden divide-y divide-border/60">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {debouncedSearch ? 'Niciun client găsit pentru această căutare.' : 'Niciun client înregistrat.'}
            </div>
          ) : (
            items.map(client => (
              <div
                key={client.id}
                onClick={() => toggleSelect(client)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 border-l-2 ${
                  selected?.id === client.id ? 'border-l-primary bg-primary/5' : 'border-l-transparent'
                }`}
              >
                <div className={`size-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(client.id)}`}>
                  {client.denumire.charAt(0).toUpperCase()}
                </div>
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
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[35%]">Denumire / CIF</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Localitate</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Creat / Modificat</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-28">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                    {debouncedSearch ? 'Niciun client găsit pentru această căutare.' : 'Niciun client înregistrat.'}
                  </td>
                </tr>
              ) : (
                items.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => toggleSelect(client)}
                    className={`cursor-pointer border-l-2 transition-colors ${
                      selected?.id === client.id
                        ? 'border-l-primary bg-primary/5 hover:bg-primary/5'
                        : 'border-l-transparent hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(client.id)}`}>
                          {client.denumire.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{client.denumire}</p>
                          <p className="text-xs text-muted-foreground">{client.cif} · {client.tip_firma}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-45">
                      {client.email ?? <span className="italic">—</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {client.localitate ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <DatePair created={client.created_at} modified={client.modified_at} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={client.user_id ? 'success' : 'outline'}>
                        {client.user_id ? 'Cont activ' : 'Fără cont'}
                      </Badge>
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
          onSuccess={() => setSelected(null)}
        />
      )}

      {showCreate && <CreateClientModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
