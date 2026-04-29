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

const iconVariants = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  destructive: 'bg-destructive/10 text-destructive',
}

export function StatCard({ label, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn('size-8 rounded-lg flex items-center justify-center', iconVariants[variant])}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold text-foreground leading-none">{value}</p>
        {trend && <p className="text-xs text-muted-foreground mb-0.5">{trend}</p>}
      </div>
    </div>
  )
}
