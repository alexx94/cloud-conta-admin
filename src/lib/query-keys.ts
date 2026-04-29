export const queryKeys = {
  auth: ['auth'] as const,

  stats: ['stats'] as const,

  clients: {
    all: ['clients'] as const,
    list: (page: number, search: string) =>
      ['clients', 'list', { page, search }] as const,
  },

  accountants: {
    all: ['accountants'] as const,
    list: (page: number, search: string) =>
      ['accountants', 'list', { page, search }] as const,
  },

  contracts: {
    all: ['contracts'] as const,
    list: (page: number) => ['contracts', 'list', { page }] as const,
    activeLinks: () => ['contracts', 'active-links'] as const,
    detail: (id: number) => ['contracts', 'detail', id] as const,
  },

  payments: {
    all: ['payments'] as const,
    list: (cursor: number | null, status: string, clientSearch: string, tip: string) =>
      ['payments', 'list', { cursor, status, clientSearch, tip }] as const,
    summary: () => ['payments', 'summary'] as const,
  },
}
