import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ShieldCheck,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/features/auth/api/useLogout'
import { useAuth } from '@/features/auth/queries/useAuth'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/' as const, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users' as const, label: 'Utilizatori', icon: Users },
  { to: '/contracts' as const, label: 'Contracte', icon: FileText },
  { to: '/payments' as const, label: 'Plăți', icon: CreditCard },
]

export function Sidebar() {
  const { data: auth } = useAuth()
  const { mutate: logout, isPending } = useLogout()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const closeMobile = () => setIsMobileOpen(false)

  return (
    <>
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-background border-b border-border flex items-center px-4 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => setIsMobileOpen(true)} className="px-2 text-secondary-foreground hover:bg-secondary">
          <PanelLeft className="size-5" />
        </Button>

        <div className="flex-1 flex justify-center items-center pr-10">
          <ShieldCheck className="size-5 text-primary mr-1.5" />
          <p className="text-base font-extrabold text-sidebar-foreground tracking-tight">CloudConta</p>
        </div>
      </header>

      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <button
          aria-label="Închide meniul"
          className="absolute inset-0 bg-black/40"
          onClick={closeMobile}
        />

        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar border-r border-sidebar-border text-sidebar-foreground p-0 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="p-5 flex items-center justify-between shrink-0 border-b border-sidebar-border/30">
            <p className="text-lg font-extrabold text-sidebar-primary flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
              CloudConta
            </p>
            <Button variant="ghost" size="sm" onClick={closeMobile} className="h-7 w-7 px-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-secondary">
              <PanelLeftClose className="size-4" />
            </Button>
          </div>

          <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to

                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeMobile}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </nav>

          <div className="px-3 py-4 border-t border-sidebar-border/30 bg-sidebar/50 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {auth?.user?.email?.[0]?.toUpperCase() ?? 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {auth?.user?.email}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                closeMobile()
                logout()
              }}
              disabled={isPending}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors disabled:opacity-50"
            >
              <LogOut className="size-4 shrink-0" />
              Deconectare
            </button>
          </div>
        </aside>
      </div>

      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar shadow-sm">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
          <ShieldCheck className="size-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">CloudConta</p>
          <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath === to

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="size-7 rounded-full bg-primary/15 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {auth?.user?.email?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {auth?.user?.email}
            </p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors disabled:opacity-50"
        >
          <LogOut className="size-4 shrink-0" />
          Deconectare
        </button>
      </div>
      </aside>
    </>
  )
}
