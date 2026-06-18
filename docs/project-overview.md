# MovieHub FE Project Overview

Reviewed: 2026-06-18

## Identity

MovieHub FE is a Vietnamese movie streaming frontend built with Next.js App Router, React, and TypeScript. The app covers movie discovery, search, detail pages, video playback, watch-together rooms, account pages, personalization, comments, reviews, playlists, notifications, and SEO metadata.

The repository is a single Next.js application, not a monorepo.

## Tech Stack

| Area          | Implementation                                      |
| ------------- | --------------------------------------------------- |
| Runtime       | Node.js 20 in Docker, Next.js standalone output     |
| Framework     | Next.js 16 App Router, React 19                     |
| Language      | TypeScript                                          |
| Font          | Be Vietnam Pro via `next/font/google`               |
| Data fetching | TanStack Query 5 with SSR hydration                 |
| HTTP          | Axios through `src/utils/http.util.ts`              |
| State         | Zustand stores in `src/store/`                      |
| Forms         | React Hook Form with Zod schemas                    |
| Styling       | Tailwind CSS v4, shadcn/ui, Radix primitives        |
| Motion        | Framer Motion                                       |
| Video         | Vidstack and HLS.js                                 |
| Realtime      | MQTT client with query invalidation                 |
| Notifications | React Toastify through the `notify` utility         |
| Lint/format   | ESLint, Prettier, lint-staged                       |
| Deployment    | Docker image built and deployed from GitHub Actions |

## Main Directories

```text
src/
  api-requests/        Domain request wrappers around the shared HTTP client
  app/                 Next.js App Router routes, layouts, route handlers, metadata
  assets/              Local icons and images
  components/          Shared UI, app widgets, layout, providers, video player
  constants/           API configs, query keys, storage keys, master data
  hooks/               Reusable client hooks
  lib/                 Shared helpers, including `cn` and MQTT client setup
  logger/              Logging wrapper
  queries/             TanStack Query hooks by domain
  routes/              Central route path definitions
  schemaValidations/   Zod schemas
  store/               Zustand stores
  styles/              Shared CSS
  types/               TypeScript domain and API types
  utils/               HTTP, URL, storage, date, text, MQTT, notify utilities
```

## Route Groups And Pages

```text
src/app/(home)/             Home page sections: slider, collections, recommendations, continue watching
src/app/(auth)/             Login, register, forgot password, verify OTP, intro gate
src/app/auth/google/        Google OAuth callback route
src/app/movie/[slug]/       Movie detail page
src/app/movie/(type)/       Single and series listing pages
src/app/watch/[slug]/       Watch page and playback experience
src/app/search/             Search results and advanced filters
src/app/category/[slug]/    Category movie lists
src/app/country/[slug]/     Country movie lists
src/app/person/             Person directory and person detail page
src/app/topic/              Topic directory and topic detail pages
src/app/schedule/           Movie schedule
src/app/room/               Watch-together room lobby
src/app/survey/             Protected onboarding survey
src/app/user/               Protected user pages: favourites, notifications, playlists, history
src/app/account/            Protected account pages: profile, settings, password change
src/app/api/auth/           Internal auth/session route handlers
src/app/api/intro/          Intro access validation route
src/app/og/                 Dynamic Open Graph image route
```

Dynamic movie-like routes use a `slug.id` format. Extract the id with `getIdFromSlug()` or the `useSlugId()` hook. Plain id routes, such as `/person/[id]`, use the raw `id` param.

## Root Runtime Composition

The root layout in `src/app/layout.tsx` installs the global runtime stack:

```text
html/body
  JsonLd Organization + WebSite schema
  BodyLoad
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

Important implications:

- TanStack Query is available to the whole app.
- Categories are prefetched globally for navigation and filter UI.
- Session and profile hydration happen in `AppProvider`.
- MQTT subscriptions are started globally after the app mounts.
- Toasts should use `notify.success()` and `notify.error()`.

## Commands

| Command                          | Use                                                    |
| -------------------------------- | ------------------------------------------------------ |
| `yarn dev`                       | Start local dev server on port 3000 with Turbopack     |
| `yarn clean-dev`                 | Remove `.next` then start dev server                   |
| `yarn lint`                      | Run ESLint over the repo                               |
| `yarn lint -- src/path/file.tsx` | Verify a focused file                                  |
| `yarn build`                     | Production build; `prebuild` removes `.next` and `out` |
| `yarn build:analyze`             | Production build with bundle analyzer                  |
| `yarn start`                     | Start production server                                |
| `yarn format`                    | Format files with Prettier                             |

No test runner is configured. For pre-commit or dependency/build changes, run:

```bash
yarn lint && yarn build
```

## Configuration

`src/config.ts` validates public environment variables at startup with Zod. Missing or invalid values fail the app early.

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

Server-only variables are consumed in route handlers and Docker runtime:

```text
APP_USERNAME
APP_PASSWORD
GRANT_TYPE_REFRESH_TOKEN
ACCESS_KEY
```

Do not read or commit real `.env` or `.env.local` values.

## Deployment

The app builds as a Next.js standalone output. The Dockerfile has three stages:

1. `deps`: install dependencies with Yarn.
2. `builder`: inject `NEXT_PUBLIC_*` build args and run `yarn build`.
3. `runner`: copy `.next/standalone`, `.next/static`, and `public`, then run `node server.js`.

`.github/workflows/docker.yml` builds and pushes `${DOCKER_USERNAME}/fe-moviehub:latest`, connects to the VPS through OpenVPN, replaces the running `fe-moviehub` container, and sends Discord success/failure notifications.
