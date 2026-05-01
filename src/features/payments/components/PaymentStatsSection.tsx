import { useState } from 'react'
import { CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/ui/stat-card'
import { cn } from '@/lib/utils'
import { paymentStatsOptions } from '@/features/payments/queries'
import type { StatsPeriod } from '@/features/payments/types'

type PeriodOption = { id: StatsPeriod; label: string; trend: string }

const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'last_30_days', label: 'Ultimele 30 zile', trend: 'Ultimele 30 zile' },
  { id: 'last_3_months', label: 'Ultimele 3 luni', trend: 'Ultimele 3 luni' },
  { id: 'current_year', label: 'Anul curent', trend: 'Anul curent' },
]

function getDateRange(period: StatsPeriod): { dateFrom: string; dateTo: string } {
  const today = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  if (period === 'last_30_days') {
    const from = new Date(today)
    from.setDate(from.getDate() - 30)
    return { dateFrom: fmt(from), dateTo: fmt(today) }
  }
  if (period === 'last_3_months') {
    const from = new Date(today)
    from.setMonth(from.getMonth() - 3)
    return { dateFrom: fmt(from), dateTo: fmt(today) }
  }
  const year = today.getFullYear()
  return { dateFrom: `${year}-01-01`, dateTo: `${year}-12-31` }
}

function formatRON(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PaymentStatsSection() {
  const [period, setPeriod] = useState<StatsPeriod>('current_year')
  const { dateFrom, dateTo } = getDateRange(period)
  const { data: stats } = useQuery(paymentStatsOptions(dateFrom, dateTo))
  const trendLabel = PERIOD_OPTIONS.find(p => p.id === period)!.trend

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Situație plăți</h2>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
          {PERIOD_OPTIONS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                period === p.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total încasat"
          value={formatRON(stats?.total_incasat ?? 0)}
          icon={CheckCircle}
          variant="success"
          trend={trendLabel}
        />
        <StatCard
          label="De încasat"
          value={formatRON(stats?.total_neincasat ?? 0)}
          icon={TrendingUp}
          variant="warning"
          trend={trendLabel}
        />
        <StatCard
          label="Scadență depășită"
          value={formatRON(stats?.total_depasit ?? 0)}
          icon={AlertTriangle}
          variant="destructive"
          trend={trendLabel}
        />
      </div>
    </div>
  )
}
