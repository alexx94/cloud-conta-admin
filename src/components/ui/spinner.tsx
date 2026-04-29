import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}
