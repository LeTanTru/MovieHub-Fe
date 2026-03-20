# Copilot instructions for MovieHub-FE

## Build, lint, and verification commands

- Install deps: `yarn install`
- Dev server (port 3000, Turbopack): `yarn dev`
- Clean + dev: `yarn clean-dev`
- Lint full repo: `yarn lint`
- Build production bundle: `yarn build`
- Start production server: `yarn start`
- Format: `yarn format`

There is currently **no automated test script** in `package.json` and no Jest/Vitest/Playwright test config in this repository.

Single-test command: not available (no test runner is configured).

For focused verification on one file, run ESLint via the existing lint script with a file argument:

- `yarn lint -- src/path/to/file.tsx`

## High-level architecture

- Framework: Next.js 16 App Router (`src/app`) with route groups (e.g. `src/app/(home)`) and dynamic routes (`[slug]`, `[id]`).
- Root app composition is in `src/app/layout.tsx`, wrapping pages with `QueryProvider`, `AppProvider`, `ThemeProvider`, top loader, and toast container.
- Data flow is layered:
  - API endpoint contracts: `src/constants/api-config.ts`
  - Domain request wrappers: `src/api-requests/*.api-request.ts`
  - React Query hooks: `src/queries/*.query.ts`
- Server components prefetch with TanStack Query and hydrate on the client via `HydrationBoundary` + `dehydrate` (see `src/app/(home)/page.tsx`, `src/app/movie/[slug]/page.tsx`, `src/app/watch/[slug]/page.tsx`).
- Movie detail and watch routes use a `slug.id` URL convention and resolve the id using `getIdFromSlug` before querying APIs.
- Authentication/network behavior is centralized in `src/utils/http.util.ts`:
  - Injects `Authorization`, `X-Tenant`, and `X-Client-Type` headers.
  - Handles 401 token refresh with a shared queue to prevent parallel refresh races.
  - Syncs refreshed credentials through internal auth API routes under `src/app/api/auth/*`.
- Route access control is implemented in `src/proxy.ts`:
  - Public auth pages: `/login`, `/register`, `/forgot-password`, `/verify-otp`
  - Protected prefixes: `/user`, `/account`

## Key conventions specific to this codebase

- Environment variables are validated at module import in `src/config.ts` with Zod; missing/invalid env fails startup/build.
- Use the project alias `@/*` (configured in `tsconfig.json`) instead of deep relative imports.
- Keep React Query keys centralized in `src/constants/master-data.ts` (`queryKeys`) and reuse them in queries/mutations.
- New API request modules should define endpoints in `api-config.ts` and call through shared `http` utilities (path params replacement, standard headers/auth behavior).
- QueryClient defaults are intentionally opinionated in `src/components/providers/query-provider/get-query-provider.ts`: `staleTime` 60s, `retry` false, `refetchOnWindowFocus` false.
- Tailwind uses v4 theme tokens from `src/app/globals.css` (`@theme inline`) with custom breakpoints like `max-990:*`, `max-860:*`, etc.
- Use `cn(...)` from `src/lib/utils.ts` for class composition (`twMerge(clsx(...))`) so later utilities can override earlier classes predictably.
- Video player caption/quality labels should be normalized through `getLanguageLabel` for Vietnamese-friendly display.
