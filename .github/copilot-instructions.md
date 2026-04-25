# Copilot instructions for MovieHub-FE

## Build, test, and lint commands

- Install dependencies: `yarn install`
- Dev server (port 3000, Turbopack): `yarn dev`
- Clean cache + dev: `yarn clean-dev`
- Lint all files: `yarn lint`
- Build production bundle: `yarn build`
- Build with bundle analyzer: `yarn build:analyze`
- Start production server: `yarn start`
- Format code: `yarn format`

There is no test runner configured in this repository (`package.json` has no test script, and no Jest/Vitest/Playwright config).

Single-test command: not available.

Closest focused check:

- `yarn lint -- src/path/to/file.tsx`

When changing dependencies, Docker, or build config, run:

- `yarn lint && yarn build`

## High-level architecture

- Next.js 16 App Router app under `src/app`, using route groups (`(home)`, `(auth)`) and dynamic routes (e.g. `[slug]`).
- Root composition is in `src/app/layout.tsx`: app-level SEO metadata + JSON-LD, then `QueryProvider` -> `AppProvider` -> `ThemeProvider`, plus top loader and toast container.
- Backend data flow follows one path:
  1. define endpoint contracts in `src/constants/api-config.ts`
  2. wrap API calls in `src/api-requests/*.api-request.ts`
  3. expose React Query hooks in `src/queries/*.query.ts`
  4. consume with centralized `queryKeys` from `src/constants/master-data.ts`
- Server-rendered pages prefetch data with TanStack Query and hydrate client components via `dehydrate` + `HydrationBoundary` (notably home/movie/watch routes).
- HTTP/auth behavior is centralized in `src/utils/http.util.ts`:
  - injects `Authorization` and optional `X-Client-Type`
  - handles 401 refresh with a shared queue to avoid parallel refresh races
  - syncs auth via internal routes under `src/app/api/auth/*`
- Route guarding lives in `src/proxy.ts`:
  - auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/intro`
  - protected prefixes: `/user`, `/account`, `/survey`

## Key conventions specific to this codebase

- Use `@/*` imports for `src/*` paths (avoid deep relative imports).
- Query keys must be added to/reused from `queryKeys` in `src/constants/master-data.ts`.
- Keep API integration layered (`api-config` -> `api-request` -> `query`) instead of calling Axios directly from components.
- Use `getIdFromSlug` for `slug.id` routes before API calls.
- Use `cn()` from `@/lib/utils.ts` for class merging; Tailwind uses custom breakpoints like `max-990`, `max-860`, `max-768`, etc.
- Use `notify.success()` / `notify.error()` for mutation feedback and `logger` from `@/logger` instead of `console.log`.
- Environment expectations:
  - public build-time vars are validated in `src/config.ts` (`NEXT_PUBLIC_*` keys)
  - server-only vars used by API routes are `APP_USERNAME`, `APP_PASSWORD`, `GRANT_TYPE_REFRESH_TOKEN`, `ACCESS_KEY`
  - for Docker: pass `NEXT_PUBLIC_*` at build time, but inject non-`NEXT_PUBLIC_` vars at container runtime
- Do not bypass internal auth API routes for token refresh/logout flows.
- If you add auth pages or protected sections, update `src/proxy.ts` to keep access rules consistent.
