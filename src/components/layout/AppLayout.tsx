import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      <Sidebar />
      <main className="min-h-dvh pt-14 lg:pt-0 lg:ml-60 transition-all duration-300">
        <div className="p-4 sm:p-6 md:p-8 mx-auto max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  )
}
