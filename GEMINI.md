# MovieHub - Gemini CLI Context

This file provides critical context and guidelines for Gemini CLI interactions within the **MovieHub** project.

## Project Overview

**MovieHub** is a production-grade Vietnamese movie streaming platform built with the latest React and Next.js ecosystem.

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix Primitives), Framer Motion
- **Data Fetching:** TanStack React Query v5, Axios
- **State Management:** Zustand
- **Video Playback:** Vidstack + HLS.js
- **Validation:** Zod + React Hook Form

## Architecture & Data Flow

### 1. Data Fetching Pattern

Strictly follow the layered architecture for all API interactions:

1. **Define Endpoints:** `src/constants/api-config.ts`
2. **Request Wrappers:** `src/api-requests/<domain>.api-request.ts` (using the `http` utility)
3. **React Query Hooks:** `src/queries/<domain>.query.ts`
4. **Consumption:** Use the custom hooks in components.

### 2. HTTP Utility (`src/utils/http.util.ts`)

- Centralized Axios instance.
- Automatic Bearer token injection.
- 401 Unauthorized handling with automatic token refresh and request queuing.
- Support for path parameter substitution (`:id`).

### 3. Configuration & Security

- **Env Validation:** `src/config.ts` uses Zod to validate environment variables at runtime.
- **Route Protection:** `src/proxy.ts` (invoked by `middleware.ts`) manages access to private (`/user`, `/account`, `/survey`) and auth-only (`/login`, `/register`) routes.
- **Logging:** Use `@/logger` instead of `console.log`.

## Development Guidelines

### Key Commands

- **Dev:** `yarn dev` (uses Turbopack)
- **Build:** `yarn build`
- **Lint:** `yarn lint`
- **Format:** `yarn format`

### Naming Conventions

| File Category    | Pattern                   | Example                |
| :--------------- | :------------------------ | :--------------------- |
| **Components**   | PascalCase                | `MovieCard.tsx`        |
| **Hooks**        | camelCase (`use-`)        | `use-auth.ts`          |
| **API Requests** | `<domain>.api-request.ts` | `movie.api-request.ts` |
| **Queries**      | `<domain>.query.ts`       | `movie.query.ts`       |
| **Stores**       | `<domain>.store.ts`       | `auth.store.ts`        |
| **Schemas**      | `<domain>.schema.ts`      | `auth.schema.ts`       |
| **Utils**        | `<name>.util.ts`          | `http.util.ts`         |

### Coding Standards

- **Imports:** Always use the `@/*` alias for `src/` directory imports.
- **Components:** Default to Server Components; use `'use client'` only when necessary.
- **Styling:** Use the `cn()` utility from `@/lib/utils` for dynamic class merging.
- **Query Keys:** Centralize all React Query keys in `src/constants/master-data.ts`.
- **Commits:** Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

## Important Directories

- `src/api-requests/`: Domain-specific API definitions.
- `src/app/`: Next.js App Router structure (pages, layouts, actions).
- `src/components/ui/`: shadcn/ui shared primitives.
- `src/constants/`: Centralized API configs, query keys, and master data.
- `src/queries/`: Custom TanStack React Query hooks.
- `src/schemaValidations/`: Zod schemas for forms and API responses.
- `src/types/`: Centralized TypeScript definitions.

## Specialized Agent Rules

- Consult `.kilo/rules/restricted-files.md` for files that should not be modified without explicit instruction.
- Refer to `AGENTS.md` or `CLAUDE.md` if they contain additional specific agent instructions.
