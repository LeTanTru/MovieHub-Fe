# AGENTS.md - MovieHub-FE Development Guide

## Build, Lint & Test Commands

| Command                             | Description                       |
| ----------------------------------- | --------------------------------- |
| `yarn install`                      | Install dependencies              |
| `yarn dev`                          | Dev server (port 3000, Turbopack) |
| `yarn clean-dev`                    | Clean .next cache + dev           |
| `yarn build`                        | Production build                  |
| `yarn start`                        | Production server                 |
| `yarn lint`                         | ESLint on all files               |
| `yarn lint -- src/path/to/file.tsx` | Lint a single file                |
| `yarn format`                       | Prettier format all files         |

**No test runner is configured.** No Jest/Vitest/Playwright exists. For single-file verification, use `yarn lint -- src/path/to/file.tsx`.

Before committing: `yarn lint && yarn build`

## Architecture Overview

- **Framework**: Next.js 16 App Router with route groups (`(home)`, `(auth)`) and dynamic routes (`[slug]`)
- **State**: Zustand (client) + TanStack React Query (server)
- **HTTP**: Axios with auto token refresh (401 handling)
- **Forms**: React Hook Form + Zod validation
- **UI**: shadcn/ui (new-york style) + Tailwind CSS v4

### Canonical Data Flow

```
api-config.ts → *.api-request.ts → *.query.ts → Component
```

1. Define endpoint in `src/constants/api-config.ts`
2. Create request wrapper in `src/api-requests/<domain>.api-request.ts`
3. Create React Query hook in `src/queries/<domain>.query.ts`
4. Consume in components with `queryKeys` from `src/constants/master-data.ts`

## Code Style & Conventions

### Imports

- Always use `@/*` alias for `src/*` imports (e.g., `@/hooks`, `@/utils`)
- Order: external libs → `@/` aliases → relative imports
- Barrel exports via `index.ts` in: `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, `schemaValidations/`

### Naming Conventions

- **Components**: PascalCase (`CommentItem.tsx`)
- **Hooks**: camelCase with `use-` prefix (`use-auth.ts`)
- **API files**: `<domain>.api-request.ts`
- **Query files**: `<domain>.query.ts`
- **Type files**: `<domain>.type.ts`
- **Schema files**: `<domain>.schema.ts`
- **Store files**: `<domain>.store.ts`
- **Utils**: `<name>.util.ts`
- **Private dirs**: `_components/` (underscore prefix)
- **Types**: `*ResType` (response), `*SearchType` (search params), `*BodyType` (request body), `*StoreType` (Zustand)

### Component Patterns

- Server components by default; mark client with `'use client'` at top
- Use `cn()` from `@/lib` for conditional className composition
- Pages use server-side prefetch with `dehydrate`/`HydrationBoundary` pattern:
  ```tsx
  // Server component (page.tsx)
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientComponent />
    </HydrationBoundary>
  );
  ```
- Route params: use `getIdFromSlug` to extract IDs from `slug` params
- Tailwind breakpoints: custom `max-990:*`, `max-860:*`, `max-768:*`, `max-640:*`, `max-520:*`, `max-480:*`, `max-420:*`

### State Management

- **QueryClient defaults**: `staleTime: 60s`, `retry: false`, `refetchOnWindowFocus: false`
- Query keys centralized in `queryKeys` from `@/constants`
- Zustand stores in `src/store/` with `useShallow` for selector optimization
- Auth state: use `useAuth()` hook (wraps `auth.store.ts`)

### API & HTTP Layer

- Axios instance in `src/utils/http.util.ts` with:
  - Auto `Authorization` header (Bearer token from cookies/localStorage)
  - Auto `X-Client-Type` header when required
  - 401 token refresh with request queue (prevents parallel refresh races)
  - FormData support for file uploads
- API response types: `ApiResponse<T>` or `ApiResponseList<T>`
- Mutation pattern: `mutateAsync(payload, { onSuccess, onError })`

### Error Handling

- API errors: caught by Axios interceptor, auto token refresh on 401
- Form validation: Zod schemas in `src/schemaValidations/`
- Notifications: use `notify.success()` / `notify.error()` from `@/utils`
- Logging: use `logger` from `@/logger` (not `console.log`)
- **Every API mutation must show a notification** for both success and error cases

### TypeScript

- `any` is allowed (`@typescript-eslint/no-explicit-any: 'off'`)
- Unused vars: warn (prefix with `_` to suppress)
- Type suffixes: `*ResType` (response), `*SearchType` (search), `*BodyType` (request), `*StoreType` (Zustand)
- Zod schemas: `z.infer<typeof schema>` for type derivation

### Git & Commits

- Conventional commits enforced via `@commitlint/cli`
- Pre-commit hook: `lint-staged` runs ESLint + Prettier on staged files
- **Never commit** without running `yarn lint` first
- Commit format: `type(scope): description` (e.g., `fix(comment): add success notification for reply`)

## Environment Variables

Validated in `src/config.ts` with Zod. Required keys:
`NEXT_PUBLIC_NODE_ENV`, `NEXT_PUBLIC_AUTH_API_URL`, `NEXT_PUBLIC_API_ENDPOINT_URL`, `NEXT_PUBLIC_API_MEDIA_URL`, `NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_TINYMCE_URL`, `NEXT_PUBLIC_APP_USERNAME`, `NEXT_PUBLIC_APP_PASSWORD`, `NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN`, `NEXT_PUBLIC_MEDIA_HOST`, `NEXT_PUBLIC_ACCESS_KEY`, `NEXT_PUBLIC_CLIENT_TYPE`

## Route Protection

Guarded by `src/proxy.ts`. Protected prefixes: `/user`, `/account`. Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`.

## Key Files Reference

| Purpose          | Location                                   |
| ---------------- | ------------------------------------------ |
| Root layout      | `src/app/layout.tsx`                       |
| Route protection | `src/proxy.ts`                             |
| HTTP client      | `src/utils/http.util.ts`                   |
| Query provider   | `src/components/providers/query-provider/` |
| API endpoints    | `src/constants/api-config.ts`              |
| Query keys       | `src/constants/master-data.ts`             |
| Video player     | `src/components/video-player/`             |

## Key Files Reference

| Purpose          | Location                                   |
| ---------------- | ------------------------------------------ |
| Root layout      | `src/app/layout.tsx`                       |
| Route protection | `src/proxy.ts`                             |
| HTTP client      | `src/utils/http.util.ts`                   |
| Query provider   | `src/components/providers/query-provider/` |
| API endpoints    | `src/constants/api-config.ts`              |
| Query keys       | `src/constants/master-data.ts`             |
| Video player     | `src/components/video-player/`             |
