import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const customMessage = query.meta?.errorMessage as string;
      toast.error(customMessage || `A aparut o eroare la incarcarea datelor: ${error.message}`);
    }
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const customMessage = mutation.meta?.errorMessage as string | undefined;
      if (customMessage) {
        toast.error(customMessage, { description: error.message });
      } else {
        toast.error(`A aparut o eroare: ${error.message}`);
      }
    }
  }),

  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})
