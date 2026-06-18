# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Snapshot

MovieHub FE is a Vietnamese movie streaming frontend built as a single Next.js App Router application.

- Framework: Next.js 16, React 19
- Language: TypeScript
- Styling: Tailwind CSS v4, shadcn/ui, Radix primitives, Framer Motion
- Data: TanStack Query 5, Axios
- Client state: Zustand
- Forms: React Hook Form + Zod
- Video: Vidstack + HLS.js
- Realtime: MQTT
- Deployment: standalone Next.js Docker image deployed by GitHub Actions

## Build Commands

```bash
yarn install          # Install dependencies
yarn dev              # Dev server on port 3000 with Turbopack
yarn clean-dev        # Remove .next and start dev
yarn build            # Production build
yarn build:analyze    # Production build with bundle analyzer
yarn start            # Production server
yarn lint             # ESLint all files
yarn lint -- src/path # Lint a focused file
yarn format           # Prettier format
```

No test runner is configured. For verification use `yarn lint`; when changing dependencies, build config, or shared behavior, run `yarn lint && yarn build`.

## Architecture

### Data Flow

Follow the 4-layer API pattern for backend data:

```text
src/constants/api-config.ts
  -> src/api-requests/<domain>.api-request.ts
  -> src/queries/<domain>.query.ts
  -> component/hook/route
```

Add new query keys to `queryKeys` in `src/constants/master-data.ts`.

Every `useQuery` should unwrap responses with `select: (data) => data.data` or `data.data.content`. Components should receive unwrapped data and should not use `data.data`.

### HTTP Layer

`src/utils/http.util.ts` wraps Axios and handles:

- Bearer token injection from cookies or Zustand
- `X-Client-Type` when required by endpoint config
- CSRF header support when configured
- 401 refresh queue to avoid parallel refresh races
- FormData uploads
- `:id` path parameter substitution
- request timeout

Core auth sync goes through internal route handlers under `src/app/api/auth/*`; do not bypass these for login, logout, session, or refresh.

### App Composition

`src/app/layout.tsx` composes:

```text
JsonLd + BodyLoad
QueryProvider
  CategoryPrefetchBoundary
    AppProvider
      ThemeProvider
        Suspense -> children
        DisclaimerModal
        MqttProvider
        NextTopLoader
        GoToTopButton
      ToastContainer
```

### Route Protection

`src/proxy.ts` controls auth redirects.

- Protected prefixes: `/user`, `/account`, `/survey`
- Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`
- Authenticated users are redirected away from auth pages.
- Unauthenticated users hitting protected pages are redirected to login with `redirect`.

## Server And Client State

- Query defaults in `src/components/providers/query-provider/get-query-client.ts`: `staleTime: 60s`, `retry: false`, `refetchOnWindowFocus: false`.
- SSR prefetch uses `getQueryClient()`, `dehydrate`, and `HydrationBoundary`.
- Zustand stores live in `src/store/`; use `useShallow` for selectors that return objects.
- Realtime MQTT events should invalidate query keys rather than patching component state directly.

## Key Conventions

- Use `@/*` alias for `src/*` imports.
- Server components by default; add `'use client'` only when needed.
- Use `cn()` from `@/lib` for className composition.
- Query keys are centralized in `src/constants/master-data.ts`.
- Tailwind custom breakpoints: `max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`.
- Notifications: `notify.success()` and `notify.error()` from `@/utils` for API mutations.
- Logging: use `logger` from `@/logger`; do not use `console.log`.
- Dynamic movie-like routes use `slug.id`; extract ID with `getIdFromSlug()` or `useSlugId()`.
- Plain id routes, such as `/person/[id]`, use the raw `id`.
- Video player logic uses Vidstack + HLS.js and watch-specific hooks/context under `src/app/watch/[slug]/`.
- Conventional commits: `type(scope): description`.
- Barrel exports are expected in `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, and `schemaValidations/`.

## Environment Variables

Validated at startup in `src/config.ts`.

Required public variables:

```text
NEXT_PUBLIC_NODE_ENV
NEXT_PUBLIC_AUTH_API_URL
NEXT_PUBLIC_API_ENDPOINT_URL
NEXT_PUBLIC_API_MEDIA_URL
NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL
NEXT_PUBLIC_URL
NEXT_PUBLIC_MEDIA_HOST
NEXT_PUBLIC_CLIENT_TYPE
NEXT_PUBLIC_MQTT_BROKER
NEXT_PUBLIC_MQTT_USERNAME
NEXT_PUBLIC_MQTT_PASSWORD
```

Server-only runtime variables:

```text
APP_USERNAME
APP_PASSWORD
GRANT_TYPE_REFRESH_TOKEN
ACCESS_KEY
```

Do not read `.env`, `.env.local`, `supersecrets.txt`, or `credentials.json`.

## Naming Conventions

| Type           | Pattern                                | Example                |
| -------------- | -------------------------------------- | ---------------------- |
| API files      | `<domain>.api-request.ts`              | `movie.api-request.ts` |
| Query files    | `<domain>.query.ts`                    | `movie.query.ts`       |
| Type files     | `<domain>.type.ts`                     | `movie.type.ts`        |
| Schema files   | `<domain>.schema.ts`                   | `auth.schema.ts`       |
| Store files    | `<domain>.store.ts`                    | `auth.store.ts`        |
| Utils          | `<name>.util.ts`                       | `http.util.ts`         |
| Response types | `*ResType`                             | `MovieResType`         |
| Search types   | `*SearchType`                          | `MovieSearchType`      |
| Body types     | `*BodyType`                            | `LoginBodyType`        |
| Store types    | `*StoreType`                           | `AuthStoreType`        |
| Private dirs   | `_components/`, `_hooks/`, `_context/` | `_components/slider/`  |

## Documentation

Start with `docs/README.md`. When architecture, routes, env vars, or conventions change, keep these files aligned:

- `docs/project-overview.md`
- `docs/architecture.md`
- `docs/development-guide.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`

## Important Notes

- Every API mutation should show a success/error notification.
- Auth refresh relies on internal routes under `src/app/api/auth/*`.
- Do not add protected or auth routes without checking `src/proxy.ts`.
- Do not store parsed `toxicSpans` arrays in API types; toxic spans arrive as JSON strings and should be parsed at render/use boundaries.
