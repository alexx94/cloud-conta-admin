# CLAUDE.md — Cloud Conta ADMIN

## Project Overview

Admin panel for Cloud Conta, a Romanian accounting/invoicing system. Built with React 19 + TypeScript 6, TanStack Router, TanStack Query, Supabase, and Tailwind CSS 4.

---

## Coding Rules

### React Hooks — Forbidden

Do **not** use the following React hooks:
- `useEffect`
- `useMemo`
- `useCallback`
- `useRef` (unless strictly for DOM access with no logic alternative)

Use TanStack Query (`useQuery`, `useMutation`, `useInfiniteQuery`) for all server state, derived state, and side effects that relate to data fetching or caching. Use TanStack Router (`useSearch`, `useParams`, `useNavigate`) for URL-driven state.

### Architecture

- **Feature-first structure.** Every feature lives under `src/features/<feature-name>/` with its own `api/`, `components/`, `queries/`, and `types/` subdirectories.
- **No God components.** Split large components into smaller, focused ones. Each component does one thing.
- **No God files.** Keep files short and single-purpose.
- **Shared cross-cutting logic** goes in `src/shared/` (constants, API utilities, shared contracts).
- **Reusable UI primitives** go in `src/components/ui/`. Layout wrappers go in `src/components/layout/`.

### Code Quality

- **Modular and reusable.** Extract anything used in more than one place.
- **Readable first.** Prefer explicit, descriptive names over cleverness.
- **Easy to debug.** Avoid deeply nested logic. Prefer flat, readable flows.
- **Maintainable and scalable.** No shortcuts that require rewriting later.
- **No dead code.** Do not leave unused variables, imports, or commented-out blocks.

### Comments

Default to **no comments**. Only add a comment when the *why* is non-obvious — a hidden constraint, a workaround, or a subtle invariant. Never describe what the code does; the code should speak for itself.

---

## File & Naming Conventions

| What | Convention | Example |
|---|---|---|
| React components | PascalCase | `EditClientModal.tsx` |
| Hooks / utilities | camelCase | `useLogin.ts`, `getClients.ts` |
| Directories | kebab-case | `features/users/`, `query-keys.ts` |
| Constants | UPPER_SNAKE_CASE | `PAGE_SIZE`, `CLIENT` |

---

## Import Style

Always use the `@/` alias. No relative imports.

```ts
import { Button } from '@/components/ui/button'
import { useClients } from '@/features/users/queries/clients'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
```

Import order:
1. Third-party libraries
2. Internal utilities (`@/lib`, `@/app`)
3. Feature-specific code (`@/features/...`)
4. Components (`@/components/...`)

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query 5 |
| Virtualized lists | TanStack Virtual 3 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Toasts | Sonner |

---

## Feature Directory Structure

```
src/features/<feature>/
├── api/          # Supabase calls and mutation functions
├── components/   # React components scoped to this feature
├── queries/      # TanStack Query hooks (useQuery, useMutation)
└── types/        # TypeScript types for this feature
```

---

## DO / DON'T

| DO | DON'T |
|---|---|
| Use TanStack Query for all data fetching | Use `useEffect` to fetch data |
| Keep components small and focused | Build large multi-purpose components |
| Use `@/` absolute imports | Use relative imports |
| Follow feature-first folder structure | Put everything in one file |
| Write plain, readable TypeScript | Over-abstract or over-engineer |
| Validate at system boundaries (user input, API) | Add defensive checks inside trusted internals |
