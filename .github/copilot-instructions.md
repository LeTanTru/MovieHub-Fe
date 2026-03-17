# Copilot instructions for MovieHub-FE

## Build, lint, and verification commands

- Install deps: `yarn install`
- Dev server (port 3000, Turbopack): `yarn dev`
- Clean + dev: `yarn clean-dev`
- Lint full repo: `yarn lint`
- Build production bundle: `yarn build`
- Start production server: `yarn start`
- Format: `yarn format`

There is currently **no automated test script** in `package.json` and no Jest/Vitest/Playwright test config in this repo.

Single-test command: not available (no test runner is configured).

For focused verification on one file, run ESLint directly on that file:

- `yarn eslint src/path/to/file.tsx`

## High-level architecture

- Framework: Next.js 16 App Router (`src/app`) with route groups like `src/app/(home)` and dynamic routes (`[slug]`, `[id]`).
- Root composition in `src/app/layout.tsx`: `QueryProvider` + `AppProvider` + `ThemeProvider` + top loader + toast container.
- Data flow is layered:
  - Endpoint definitions: `src/constants/api-config.ts`
  - Request wrappers per domain: `src/api-requests/*.api-request.ts`
  - React Query hooks: `src/queries/*.query.ts`
- Server components prefetch with TanStack Query (`getQueryClient`, `prefetchQuery/prefetchInfiniteQuery`) and pass dehydrated state through `HydrationBoundary` (see `src/app/(home)/page.tsx`, `src/app/movie/[slug]/page.tsx`, `src/app/watch/[slug]/page.tsx`).
- Detail/watch pages use a `slug.id` URL convention and recover the numeric id with `getIdFromSlug` before querying APIs.
- HTTP/auth behavior is centralized in `src/utils/http.util.ts`:
  - Injects `Authorization`, `X-Tenant`, and `X-Client-Type` headers.
  - Handles 401 refresh with a queue to avoid parallel refresh races.
  - Syncs refreshed tokens through internal API routes under `src/app/api/auth/*`.
- Route access control is handled in `src/proxy.ts`:
  - Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`
  - Protected prefixes: `/user`, `/account`

## Key conventions specific to this codebase

- Environment variables are validated at module import in `src/config.ts` via Zod. Missing/invalid env vars throw and fail startup/build.
- Path alias `@/*` is used project-wide (configured in `tsconfig.json`).
- Query keys are centralized in `src/constants/master-data.ts` (`queryKeys` object); reuse these keys in all React Query hooks/mutations.
- API request modules should use entries from `api-config.ts` and the shared `http` utility (supports path params replacement and standardized headers/auth flags).
- QueryClient defaults are opinionated in `get-query-provider.ts`: `staleTime` is 60s, `retry` is false, and `refetchOnWindowFocus` is false.
- Tailwind uses v4 theme tokens in `src/app/globals.css` (`@theme inline`) including custom breakpoints (`--breakpoint-990`, `--breakpoint-860`, etc.) consumed with classes like `max-990:*`.
- Use `cn(...)` from `src/lib/utils.ts` for class composition; it is `twMerge(clsx(...))`, so later utility classes override earlier ones.
- Video player language/caption labels should be passed through `getLanguageLabel` (see `src/components/video-player/_components/caption-submenu.tsx` and `quality-submenu.tsx`) for consistent Vietnamese labeling.
