# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
yarn install          # Install dependencies
yarn dev              # Dev server (port 3000, Turbopack)
yarn clean-dev        # Clean .next cache + start dev
yarn build            # Production build
yarn start            # Production server
yarn lint             # ESLint all files
yarn lint -- src/path # Lint single file
yarn format           # Prettier format
```

No test runner is configured. For verification use `yarn lint`.

When changing dependencies or build config, run `yarn lint && yarn build` to verify.

## Pre-commit

Husky + lint-staged runs ESLint + Prettier on staged files automatically on commit.

## Architecture

### Data Flow (4-layer pattern)

```
api-config.ts → *.api-request.ts → *.query.ts → Component
```

1. Define endpoint in `src/constants/api-config.ts`
2. Wrap in `src/api-requests/<domain>.api-request.ts`
3. Create React Query hook in `src/queries/<domain>.query.ts`
4. Consume with `queryKeys` from `src/constants/master-data.ts`

### HTTP Layer (`src/utils/http.util.ts`)

Axios instance with automatic:

- `Authorization: Bearer <token>` from cookies/localStorage
- `X-Client-Type` header when `isRequiredXClientType: true`
- 401 token refresh with queued request handling (prevents parallel refresh races)
- FormData support for file uploads (auto-strips Content-Type for multipart)

Auth sync: refreshed tokens sync through internal API routes (`src/app/api/auth/*`) - do not bypass this mechanism.

### Route Protection (`src/proxy.ts`)

- Protected prefixes: `/user`, `/account`, `/survey`
- Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`
- Authenticated users accessing auth pages redirect to `/`

### Server State (TanStack Query)

`QueryClient` defaults in `src/components/providers/query-provider/get-query-provider.ts`:

- `staleTime: 60s`, `retry: false`, `refetchOnWindowFocus: false`

SSR prefetch pattern in home/movie/watch pages:

```tsx
const dehydratedState = dehydrate(queryClient);
return (
  <HydrationBoundary state={dehydratedState}>
    <ClientComponent />
  </HydrationBoundary>
);
```

### Client State (Zustand)

Stores in `src/store/` using `useShallow` for selector optimization. Auth state via `useAuthStore`.

### App Composition (`src/app/layout.tsx`)

Root layout wraps with (inside-out): `ThemeProvider` → `AppProvider` → `QueryProvider` → `NextTopLoader` → children → `ToastContainer`.

## Key Conventions

- Use `@/*` alias for all `src/*` imports
- Server components by default; add `'use client'` for client components
- Use `cn()` from `@/lib/utils.ts` for className composition
- Query keys centralized in `queryKeys` object in `src/constants/master-data.ts`
- Tailwind v4 with custom breakpoints: `max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`
- Notifications: `notify.success()` / `notify.error()` from `@/utils`
- Logging: use `logger` from `@/logger`, not `console.log`
- Dynamic routes use `slug.id` convention; extract ID via `getIdFromSlug()`
- Video player: Vidstack + HLS.js, caption labels normalized via `getLanguageLabel()`
- Conventional commits enforced: `type(scope): description`
- Barrel exports via `index.ts` in: `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, `schemaValidations/`

## Environment Variables

Validated at startup in `src/config.ts` with Zod. Required keys:

```
NEXT_PUBLIC_NODE_ENV, NEXT_PUBLIC_AUTH_API_URL, NEXT_PUBLIC_API_ENDPOINT_URL,
NEXT_PUBLIC_API_MEDIA_URL, NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL, NEXT_PUBLIC_URL, NEXT_PUBLIC_MEDIA_HOST,
NEXT_PUBLIC_CLIENT_TYPE
```

## Naming Conventions

| Type           | Pattern                   | Example                |
| -------------- | ------------------------- | ---------------------- |
| API files      | `<domain>.api-request.ts` | `movie.api-request.ts` |
| Query files    | `<domain>.query.ts`       | `movie.query.ts`       |
| Type files     | `<domain>.type.ts`        | `movie.type.ts`        |
| Schema files   | `<domain>.schema.ts`      | `auth.schema.ts`       |
| Store files    | `<domain>.store.ts`       | `auth.store.ts`        |
| Response types | `*ResType`                | `MovieResType`         |
| Search types   | `*SearchType`             | `MovieSearchType`      |
| Body types     | `*BodyType`               | `LoginBodyType`        |
| Store types    | `*StoreType`              | `AuthStoreType`        |
| Private dirs   | `_components/` prefix     | `_components/slider/`  |

## Important Notes

- Every API mutation must show a success/error notification
- Auth refresh relies on internal routes under `src/app/api/auth/*` - new auth flows must go through this mechanism
- When adding new API endpoints, always add corresponding query keys to `queryKeys` in `master-data.ts`
