import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { router } from './app/router'
import { queryClient } from './app/query-client'
import { supabase } from './lib/supabase'
import './index.css'

supabase.auth.onAuthStateChange(() => {
  queryClient.invalidateQueries({ queryKey: ['auth'] })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ queryClient }} />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <TanStackRouterDevtools router={router} position="bottom-right" />
        </div>
        <div className="pointer-events-auto">
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        </div>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)
