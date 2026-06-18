# MovieHub - Gemini CLI Context

This file provides project context and working rules for Gemini CLI interactions in the MovieHub FE repository.

## Project Overview

MovieHub FE is a Vietnamese movie streaming frontend built as a single Next.js App Router application.

- Framework: Next.js 16, React 19
- Language: TypeScript
- Styling: Tailwind CSS v4, shadcn/ui, Radix primitives, Framer Motion
- Data fetching: TanStack Query 5, Axios
- State management: Zustand
- Video playback: Vidstack + HLS.js
- Forms and validation: React Hook Form + Zod
- Realtime: MQTT notifications
- Deployment: Docker standalone output through GitHub Actions

## Key Commands

```bash
yarn dev              # Dev server on port 3000 with Turbopack
yarn clean-dev        # Remove .next and start dev
yarn build            # Production build
yarn build:analyze    # Bundle analyzer build
yarn lint             # ESLint all files
yarn lint -- src/path # Lint a focused file
yarn format           # Prettier format
```

No test runner is configured. Use `yarn lint` for normal verification and `yarn lint && yarn build` for dependency, build config, or shared behavior changes.

## Architecture And Data Flow

Follow the layered architecture for all API interactions:

```text
src/constants/api-config.ts
  -> src/api-requests/<domain>.api-request.ts
  -> src/queries/<domain>.query.ts
  -> component/hook/route
```

Rules:

- Do not call backend URLs directly from components.
- Add new query keys to `queryKeys` in `src/constants/master-data.ts`.
- Every `useQuery` should use `select: (data) => data.data` or `data.data.content`.
- Components receive unwrapped data; avoid `data.data` in component code.
- Invalidate affected query keys after successful mutations.

## HTTP, Auth, And Routing

`src/utils/http.util.ts` is the centralized Axios client. It handles Bearer token injection, `X-Client-Type`, CSRF header support, 401 refresh queueing, FormData uploads, timeout, and `:id` path parameter substitution.

Core auth/session work goes through `src/app/api/auth/*` route handlers. Do not bypass those routes for login, logout, session, or refresh.

Route protection lives in `src/proxy.ts`:

- Protected prefixes: `/user`, `/account`, `/survey`
- Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`
- Update `src/proxy.ts` when adding auth-only or protected routes.

## Root Runtime Composition

`src/app/layout.tsx` installs the global runtime stack:

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

## Development Guidelines

- Use `@/*` alias for imports from `src/`.
- Default to Server Components; add `'use client'` only when needed.
- Use `cn()` from `@/lib` for dynamic class composition.
- Use `notify.success()` and `notify.error()` from `@/utils` for API mutations.
- Use `logger` from `@/logger`; do not use `console.log`.
- Keep route-local components under `_components/`, hooks under `_hooks/`, and context under `_context/`.
- Use `useShallow` for Zustand selectors that return objects.
- Dynamic movie-like routes use `slug.id`; extract IDs with `getIdFromSlug()` or `useSlugId()`.
- Plain id routes such as `/person/[id]` keep the raw `id`.
- Realtime MQTT handlers should invalidate query keys instead of manually patching UI state.

## Naming Conventions

| File Category | Pattern                        | Example                |
| ------------- | ------------------------------ | ---------------------- |
| Components    | PascalCase export name         | `MovieCard.tsx`        |
| Hooks         | `use-*` file and exported hook | `use-auth.ts`          |
| API requests  | `<domain>.api-request.ts`      | `movie.api-request.ts` |
| Queries       | `<domain>.query.ts`            | `movie.query.ts`       |
| Stores        | `<domain>.store.ts`            | `auth.store.ts`        |
| Schemas       | `<domain>.schema.ts`           | `auth.schema.ts`       |
| Utils         | `<name>.util.ts`               | `http.util.ts`         |
| Types         | `<domain>.type.ts`             | `movie.type.ts`        |

## Environment Variables

Required public variables validated by `src/config.ts`:

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

## Important Directories

- `docs/`: project docs and audit reports; start with `docs/README.md`.
- `src/api-requests/`: domain request wrappers around the HTTP utility.
- `src/app/`: App Router pages, layouts, route handlers, metadata, route-local components.
- `src/components/app/`: shared app-specific components.
- `src/components/ui/`: shadcn/ui primitives.
- `src/components/video-player/`: reusable Vidstack player.
- `src/constants/`: API config, query keys, storage keys, master data.
- `src/queries/`: TanStack Query hooks.
- `src/schemaValidations/`: Zod schemas.
- `src/store/`: Zustand stores.
- `src/types/`: domain and API TypeScript types.

## Specialized Agent Rules

- Keep `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and core docs in sync when architecture, routes, environment variables, or conventions change.
- Follow Conventional Commits: `type(scope): description`.
- Never commit without `yarn lint`.
