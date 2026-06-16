# MovieHub FE Project Overview

## Identity

MovieHub FE is a Vietnamese movie streaming frontend built with Next.js App Router, React, and TypeScript. The app covers movie discovery, search, detail pages, video watching, account pages, user personalization, comments, reviews, playlists, notifications, and SEO metadata.

The repo is a single Next.js application, not a monorepo.

## Tech Stack

| Area          | Implementation                                      |
| ------------- | --------------------------------------------------- |
| Runtime       | Node.js 20 in Docker, Next.js standalone output     |
| Framework     | Next.js 16 App Router, React 19                     |
| Font          | Be Vietnam Pro (Google Fonts, variable font)        |
| Language      | TypeScript                                          |
| Data fetching | TanStack Query 5 with SSR hydration                 |
| HTTP          | Axios through `src/utils/http.util.ts`              |
| State         | Zustand stores in `src/store/`                      |
| Forms         | React Hook Form with Zod schemas                    |
| Styling       | Tailwind CSS v4, shadcn/ui, Radix primitives        |
| Motion        | Framer Motion                                       |
| Video         | Vidstack and HLS.js                                 |
| Realtime      | MQTT client with query invalidation                 |
| Notifications | React Toastify through `notify` utility             |
| Lint/format   | ESLint, Prettier, lint-staged                       |
| Deployment    | Docker image built and deployed from GitHub Actions |

## Main Directories

```text
src/
  api-requests/        Domain request wrappers around the shared HTTP client
  app/                 Next.js App Router routes, layouts, API routes, metadata
  assets/              Local app assets
  components/          Shared UI, app widgets, layout, providers, video player
  constants/           API configs, query keys, storage keys, master data
  hooks/               Reusable client hooks
  lib/                 Small shared libraries, including `cn` and MQTT client
  logger/              Logging wrapper
  queries/             TanStack Query hooks by domain
  routes/              Central route path definitions
  schemaValidations/   Zod schemas
  store/               Zustand stores
  styles/              Global and feature CSS
  types/               TypeScript domain and API types
  utils/               HTTP, URL, storage, date, text, MQTT, notify utilities
```

## Route Groups And Pages

```text
src/app/(home)/        Home page sections: hero slider, collections, continue watching
src/app/(auth)/        Login, register, forgot password, verify OTP
src/app/movie/[slug]/  Movie detail page
src/app/watch/[slug]/  Watch page and playback experience
src/app/search/        Search results and advanced filters
src/app/category/      Category directory and category movie lists
src/app/country/       Country movie lists
src/app/person/        Person directory and person detail page
src/app/topic/         Topic collections
src/app/schedule/      Movie schedule
src/app/room/          Watch-together room lobby (SSR prefetch)
src/app/download/      App download landing page
src/app/survey/        Protected onboarding survey (genre/preference picker)
src/app/user/          Protected user pages: favourites, notifications, playlists, history
src/app/account/       Protected account pages: profile, settings, password change
src/app/api/auth/      Internal auth/session routes used by the client app
src/app/og/            Dynamic Open Graph image route
```

Dynamic movie-like routes use a `slug.id` format. The id is extracted with `getIdFromSlug()` or the `useSlugId()` hook. Plain id routes, such as `/person/[id]`, should use the raw `id` param.

## Root Runtime Composition

The root layout in `src/app/layout.tsx` installs the global runtime stack:

```text
QueryProvider
  CategoryPrefetchBoundary
    AppProvider
      ThemeProvider
        Suspense → children
        DisclaimerModal
        MqttProvider
        NextTopLoader
        GoToTopButton
      ToastContainer
BodyLoad          ← injects scroll-behavior and body classes
JsonLd            ← Organization + WebSite schema at root level
```

Important implications:

- TanStack Query is available to the whole app.
- Categories are prefetched globally for navigation/filter UI.
- Session and profile hydration happen in `AppProvider`.
- MQTT subscriptions are started globally after the app mounts.
- Toasts should use `notify.success()` and `notify.error()`.

## Commands

| Command                          | Use                                                |
| -------------------------------- | -------------------------------------------------- |
| `yarn dev`                       | Start local dev server on port 3000 with Turbopack |
| `yarn clean-dev`                 | Remove `.next` then start dev server               |
| `yarn lint`                      | Run ESLint over the repo                           |
| `yarn lint -- src/path/file.tsx` | Verify a focused file                              |
| `yarn build`                     | Production build, including `.next` cleanup        |
| `yarn build:analyze`             | Production build with bundle analyzer              |
| `yarn start`                     | Start production server                            |
| `yarn format`                    | Format files with Prettier                         |

For pre-commit or dependency changes, run:

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

Server-only variables are consumed in API routes and Docker runtime:

```text
APP_USERNAME
APP_PASSWORD
GRANT_TYPE_REFRESH_TOKEN
ACCESS_KEY
```

Do not read or commit real `.env` values.

## Deployment

The app builds as a Next.js standalone output. The Dockerfile has three stages:

1. `deps`: install dependencies with Yarn.
2. `builder`: inject `NEXT_PUBLIC_*` build args and run `yarn build`.
3. `runner`: copy `.next/standalone`, `.next/static`, and `public`, then run `node server.js`.

`.github/workflows/docker.yml` builds and pushes `${DOCKER_USERNAME}/fe-moviehub:latest`, connects to the VPS through OpenVPN, replaces the running `fe-moviehub` container, and sends Discord success/failure notifications.
