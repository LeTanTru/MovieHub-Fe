# Export Style Conventions

This document defines the canonical export style for every file category in the MovieHub FE codebase. Following these rules ensures consistency, better tree-shaking, and predictable import patterns.

---

## Rules at a Glance

| File Category                           | Export Style                       | Example                                   |
| --------------------------------------- | ---------------------------------- | ----------------------------------------- |
| Next.js **pages** (`page.tsx`)          | `export default function`          | `export default function HomePage()`      |
| Next.js **layouts** (`layout.tsx`)      | `export default function`          | `export default function RootLayout()`    |
| Next.js **loading / error / not-found** | `export default function`          | `export default function Loading()`       |
| Next.js **Route Handlers** (`route.ts`) | `export async function`            | `export async function GET()`             |
| Next.js **Server Actions**              | `export async function`            | `export async function loginAction()`     |
| **Hooks** (`use-*.ts/tsx`)              | `export const`                     | `export const useAuth = () => {}`         |
| **Utility functions** (`*.util.ts`)     | `export const`                     | `export const formatBytes = () => {}`     |
| **Constants** (`*.ts` in `constants/`)  | `export const`                     | `export const queryKeys = {}`             |
| **Types / Interfaces**                  | `export type` / `export interface` | `export type MovieResType = {}`           |
| **Zod Schemas**                         | `export const`                     | `export const loginSchema = z.object({})` |
| **Zustand Stores**                      | `export const`                     | `export const useAuthStore = create(...)` |
| **React components** (non-page)         | `export function`                  | `export function MovieCard() {}`          |

---

## Detailed Rules

### `export default function` - Pages, Layouts, and Special Files

Next.js requires a **default export** for file-system routing conventions. Use `export default function` (not an arrow function) so the function name is always visible in stack traces and React DevTools.

```tsx
// src/app/(home)/page.tsx
export default function HomePage() {
  return <main>...</main>;
}

// src/app/layout.tsx
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang='vi'>{children}</html>;
}

// src/app/loading.tsx
export default function Loading() {
  return <Spinner />;
}

// src/app/not-found.tsx
export default function NotFound() {
  return <div>404</div>;
}
```

> **Applies to:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`

---

### `export async function` - Route Handlers and Server Actions

Route Handlers in `route.ts` files and Server Actions must be **async named exports**. Never use `export default` for these.

```ts
// src/app/api/auth/login/route.ts
export async function POST(request: Request) { ... }
export async function GET(request: Request) { ... }

// src/app/api/auth/refresh/route.ts
export async function POST(request: Request) { ... }

// src/app/(home)/_actions/movie.action.ts
export async function fetchMovieAction(id: string) { ... }
```

> **Applies to:** `route.ts` HTTP method handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), Server Actions files.

---

### `export const` - Hooks

All custom hooks must use `export const` with an arrow function. This enforces consistency across the `src/hooks/` directory.

```ts
// src/hooks/use-auth.ts
export const useAuth = () => {
  ...
}

// src/hooks/use-debounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  ...
}

// Never use export default or export function for hooks
export default function useAuth() { ... }
export function useAuth() { ... }
```

---

### `export const` - Utility Functions

All utility functions in `*.util.ts` files must use `export const`.

```ts
// src/utils/http.util.ts
export const http = axios.create({ ... })

// src/utils/slug.util.ts
export const getIdFromSlug = (slug: string): string => { ... }
export const createSlug = (title: string, id: string): string => { ... }
```

---

### `export const` - Constants

All constants, query keys, API configs, and master data use `export const`.

```ts
// src/constants/master-data.ts
export const queryKeys = {
  movie: { list: 'movie-list', detail: 'movie-detail' }
} as const;

// src/constants/api-config.ts
export const API_ENDPOINTS = {
  MOVIE: { LIST: '/movies', DETAIL: '/movies/:id' }
} as const;
```

---

### `export const` - Zustand Stores

Store creators use `export const`. The store itself already acts as a hook when wrapped with `create()`.

```ts
// src/store/auth.store.ts
export const useAuthStore = create<AuthStoreType>()(
  (set) => ({ ... })
)
```

---

### `export function` - Non-Page React Components

Reusable components (not pages/layouts) use `export function`.

```tsx
// src/components/MovieCard.tsx
export function MovieCard({ movie }: { movie: MovieResType }) {
  return <div>...</div>;
}

// src/app/(home)/_components/HeroBanner.tsx
export function HeroBanner() {
  return <section>...</section>;
}
```

> **Exception:** If a component file is a Next.js routing file (`page.tsx`, `layout.tsx`, etc.) it must use `export default function` regardless of its location.

---

### `export type` / `export interface` - Types

Types and interfaces always use `export type` or `export interface`, never `export const`.

```ts
// src/types/movie.type.ts
export type MovieResType = { id: string; title: string };
export interface PaginationMeta {
  page: number;
  total: number;
}

// Use `export type` for re-exporting types
export type { MovieResType } from '@/types/movie.type';
```

---

### `export const` - Zod Schemas

Validation schemas defined with Zod use `export const`.

```ts
// src/schemaValidations/auth.schema.ts
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6)
});

export type LoginBodyType = z.infer<typeof loginSchema>;
```

---

## Anti-Patterns to Avoid

```ts
// No anonymous default exports
export default () => { ... }
export default function() { ... }

// No export default for hooks, utils, constants
export default useAuth
export default queryKeys

// No export function for hooks or utils (use export const)
export function useAuth() { ... }
export function formatBytes() { ... }

// No export default for non-page components
export default function MovieCard() { ... }

// No export const for non-page components
export const MovieCard = () => { ... }
```

---

## Quick Reference

```text
src/app/**/page.tsx           -> export default function
src/app/**/layout.tsx         -> export default function
src/app/**/loading.tsx        -> export default function
src/app/**/error.tsx          -> export default function
src/app/**/not-found.tsx      -> export default function
src/app/**/route.ts           -> export async function (GET/POST/...)
src/app/**/*.action.ts        -> export async function
src/hooks/use-*.ts            -> export const
src/utils/*.util.ts           -> export const
src/constants/*.ts            -> export const
src/store/*.store.ts          -> export const
src/components/**/*.tsx       -> export function
src/schemaValidations/*.ts    -> export const (schema), export type (inferred)
src/types/*.type.ts           -> export type / export interface
```
