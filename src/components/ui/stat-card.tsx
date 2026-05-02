import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

const accentVariants = {
  default: 'border-l-primary',
  success: 'border-l-green-500',
  warning: 'border-l-amber-500',
  destructive: 'border-l-destructive',
}

const iconVariants = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  destructive: 'bg-destructive/10 text-destructive',
}

export function StatCard({ label, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-card border border-border border-l-4 rounded-xl p-5 flex flex-col gap-4',
      accentVariants[variant],
      className,
    )}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground leading-none pt-0.5">
          {label}
        </span>
        <div className={cn('size-9 rounded-xl flex items-center justify-center shrink-0', iconVariants[variant])}>
          <Icon className="size-[18px]" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground leading-none tracking-tight">{value}</p>
        {trend && <p className="text-xs text-muted-foreground mt-2">{trend}</p>}
      </div>
    </div>
  )
}
