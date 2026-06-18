# AGENTS.md - MovieHub FE Development Guide

## Commands

- `yarn dev`: Start the dev server on port 3000 with Turbopack.
- `yarn clean-dev`: Remove `.next` and start the dev server.
- `yarn build`: Production build; `prebuild` removes `.next` and `out`.
- `yarn build:analyze`: Production build with bundle analyzer.
- `yarn lint`: Run ESLint across the repo.
- `yarn lint -- src/path/to/file.tsx`: Focused single-file verification.
- `yarn format`: Format files with Prettier.
- No test runner is configured. For pre-commit, dependency, build config, or shared behavior changes, run `yarn lint && yarn build`.
- Docker: pass `NEXT_PUBLIC_*` values at build time; inject server-only vars at container runtime.

## Architecture

- Root layout (`src/app/layout.tsx`) composes:
  `JsonLd` + `BodyLoad` -> `QueryProvider` -> `CategoryPrefetchBoundary` -> `AppProvider` -> `ThemeProvider` -> `Suspense` children, `DisclaimerModal`, `MqttProvider`, `NextTopLoader`, `GoToTopButton` -> `ToastContainer`.
- 4-layer API pattern, do not bypass:
  `src/constants/api-config.ts` -> `src/api-requests/<domain>.api-request.ts` -> `src/queries/<domain>.query.ts` -> component/hook/route.
- Add new query keys to `queryKeys` in `src/constants/master-data.ts`.
- Query `select` convention: all `useQuery` calls include `select: (data) => data.data` or `data.data.content`. Components receive unwrapped data; do not chain `?.data?.data` in components.
- HTTP client: `src/utils/http.util.ts` handles Bearer token injection, `X-Client-Type`, CSRF header support, 401 refresh queue, FormData uploads, timeout, and `:id` path param substitution.
- Auth/session sync: use internal routes under `src/app/api/auth/*`; do not bypass them for login, logout, session, or refresh.
- API response types: `ApiResponse<T>`, `ApiResponseList<T>`.
- Next.js config: `reactCompiler: true`, `output: 'standalone'`, image remote patterns, security headers, and CSS/package optimization.

## Route Protection (`src/proxy.ts`)

- Protected prefixes: `/user`, `/account`, `/survey`.
- Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`.
- Authenticated users are redirected away from auth pages.
- Unauthenticated users are redirected to login with a `redirect` query param for protected pages.
- Update `src/proxy.ts` when adding auth-only or protected routes.

## State Management

- TanStack Query defaults: `staleTime: 60s`, `retry: false`, `refetchOnWindowFocus: false`.
- SSR prefetch: use `getQueryClient()`, `dehydrate`, and `HydrationBoundary`.
- Zustand stores live in `src/store/`; use `useShallow` for selectors that return objects.
- Auth state is accessed through `useAuth()` and `auth.store.ts`.
- Realtime MQTT handlers should invalidate query keys rather than manually patching UI state.

## Repo-Specific Conventions

- Imports: use `@/*` alias for `src/*`.
- Barrel exports: keep `index.ts` or `index.tsx` exports in `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, and `schemaValidations/`.
- Naming:
  - API: `<domain>.api-request.ts`
  - Query: `<domain>.query.ts`
  - Type: `<domain>.type.ts`
  - Schema: `<domain>.schema.ts`
  - Store: `<domain>.store.ts`
  - Utils: `<name>.util.ts`
  - Private route dirs: `_components/`, `_hooks/`, `_context/`
  - Types: `*ResType`, `*SearchType`, `*BodyType`, `*StoreType`
- Dynamic routes: most movie-like links use `slug.id`; extract IDs via `getIdFromSlug()` or `useSlugId()`. Plain id routes such as `/person/[id]` keep the raw `id`.
- UI: shadcn/ui new-york style, Tailwind CSS v4, custom breakpoints `max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`.
- Use `cn()` from `@/lib` for className composition.
- Forms: React Hook Form + Zod; schemas live in `src/schemaValidations/`.
- Notifications: API mutations must use `notify.success()` or `notify.error()` from `@/utils`.
- Logging: use `logger` from `@/logger`; do not use `console.log`.
- TypeScript: `any` is allowed when pragmatic; prefix intentionally unused variables with `_`.
- Video player: Vidstack + HLS.js; caption labels use `getLanguageLabel()`.

## Documentation

- Main docs index: `docs/README.md`.
- Keep these files in sync when architecture, routes, env vars, or conventions change:
  `docs/project-overview.md`, `docs/architecture.md`, `docs/development-guide.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`.
- Mark audit/report docs with review dates and update completed recommendations instead of preserving stale line counts.

## Git & Commits

- Conventional commits: `type(scope): description`, enforced via `@commitlint/cli`.
- Husky + lint-staged runs ESLint + Prettier on staged files.
- Never commit without `yarn lint`.
- Pushing to `main` triggers Docker build, Docker push, VPS deploy through VPN, and Discord notification.

## Environment Variables

- Validated at startup in `src/config.ts` with Zod; missing or invalid values fail build/start.
- Required public keys: `NEXT_PUBLIC_NODE_ENV`, `NEXT_PUBLIC_AUTH_API_URL`, `NEXT_PUBLIC_API_ENDPOINT_URL`, `NEXT_PUBLIC_API_MEDIA_URL`, `NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_MEDIA_HOST`, `NEXT_PUBLIC_CLIENT_TYPE`, `NEXT_PUBLIC_MQTT_BROKER`, `NEXT_PUBLIC_MQTT_USERNAME`, `NEXT_PUBLIC_MQTT_PASSWORD`.
- Server-only runtime vars: `APP_USERNAME`, `APP_PASSWORD`, `GRANT_TYPE_REFRESH_TOKEN`, `ACCESS_KEY`.

## Restricted Files (DO NOT READ)

- `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`
