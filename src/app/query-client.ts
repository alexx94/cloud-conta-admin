import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  // erori pentru useQuery (GET, fetch requests)
  queryCache: new QueryCache({
    onError: (error, query) => {
      const customMessage = query.meta?.errorMessage as string;
      toast.error(customMessage || `A aparut o eroare la incarcarea datelor: ${error.message}`);
    }
  }),

  // TODO: Erori pentru useMutation (POST/PUT/DELETE, mutatii)

  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})
