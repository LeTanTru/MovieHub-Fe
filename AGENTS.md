# AGENTS.md - MovieHub-FE Development Guide

## Commands

- `yarn clean-dev`: Clean `.next` cache + start dev server (port 3000, Turbopack)
- `yarn build:analyze`: Production build with bundle analyzer
- Single file verification: `yarn lint -- src/path/to/file.tsx` (no test runner exists)
- Pre-commit/dep change check: `yarn lint && yarn build`
- Docker: Pass `NEXT_PUBLIC_*` at build time, inject non-`NEXT_PUBLIC_` vars at container runtime

## Architecture

- Root layout (`src/app/layout.tsx`) wraps: `ThemeProvider` → `AppProvider` → `QueryProvider` → `NextTopLoader` → children → `ToastContainer`
- 4-layer API pattern (do not bypass):
  `src/constants/api-config.ts` → `src/api-requests/<domain>.api-request.ts` → `src/queries/<domain>.query.ts` → Component
- Add new query keys to `queryKeys` in `src/constants/master-data.ts`
- HTTP client: `src/utils/http.util.ts` with auto Bearer token, `X-Client-Type` header, 401 refresh queue, FormData support, `:id` path param substitution
- Auth sync/refresh: Use internal routes under `src/app/api/auth/*` only, no bypass
- API response types: `ApiResponse<T>`, `ApiResponseList<T>`

## Route Protection (`src/proxy.ts`)

- Protected prefixes: `/user`, `/account`, `/survey`
- Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`
- Update this file when adding new auth/protected routes

## State Management

- TanStack Query defaults: `staleTime: 60s`, `retry: false`, `refetchOnWindowFocus: false`
- SSR prefetch: Use `dehydrate` + `HydrationBoundary` (home/movie/watch pages)
- Zustand stores in `src/store/`, use `useShallow` for selectors
- Auth: `useAuth()` hook wraps `auth.store.ts`

## Repo-Specific Conventions

- Imports: `@/*` alias for `src/*`, barrel exports via `index.ts` in `api-requests/`, `queries/`, `hooks/`, `store/`, `constants/`, `utils/`, `types/`, `routes/`, `schemaValidations/`
- Naming:
  - API: `<domain>.api-request.ts`, Query: `<domain>.query.ts`, Type: `<domain>.type.ts`, Schema: `<domain>.schema.ts`, Store: `<domain>.store.ts`, Utils: `<name>.util.ts`
  - Private dirs: `_components/` prefix
  - Types: `*ResType` (response), `*SearchType` (search), `*BodyType` (request), `*StoreType` (Zustand)
- Dynamic routes: `slug.id` format, extract ID via `getIdFromSlug()`
- UI: shadcn/ui (new-york style), Tailwind CSS v4, custom breakpoints: `max-990`, `max-860`, `max-768`, `max-640`, `max-520`, `max-480`, `max-420`
- `cn()` from `@/lib` for className composition
- Forms: React Hook Form + Zod, schemas in `src/schemaValidations/`
- Notifications: `notify.success()`/`notify.error()` from `@/utils` (required for all API mutations)
- Logging: `logger` from `@/logger`, no `console.log`
- TypeScript: `any` allowed, unused vars prefix with `_`
- Video player: Vidstack + HLS.js, caption labels via `getLanguageLabel()`

## Git & Commits

- Conventional commits: `type(scope): description`, enforced via `@commitlint/cli`
- Pre-commit: Husky + lint-staged runs ESLint + Prettier on staged files
- Never commit without `yarn lint`

## Environment Variables

- Validated at startup in `src/config.ts` with Zod, missing/invalid values fail build/start
- Required `NEXT_PUBLIC_*` keys: `NEXT_PUBLIC_NODE_ENV`, `NEXT_PUBLIC_AUTH_API_URL`, `NEXT_PUBLIC_API_ENDPOINT_URL`, `NEXT_PUBLIC_API_MEDIA_URL`, `NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_MEDIA_HOST`, `NEXT_PUBLIC_CLIENT_TYPE`
- Server-only vars (runtime): `APP_USERNAME`, `APP_PASSWORD`, `GRANT_TYPE_REFRESH_TOKEN`, `ACCESS_KEY`

## Restricted Files (DO NOT READ)

- `supersecrets.txt`, `credentials.json`, `.env`, `.env.local`
