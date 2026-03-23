# MovieHub Frontend

MovieHub Frontend is a movie streaming client built with Next.js 16 (App Router), React 19, and TypeScript.  
It delivers discovery and playback flows for movies/series, including authentication, personalized user pages, and a dedicated video player experience.

## Project Summary

This project focuses on a scalable, production-ready frontend architecture:

- **App Router structure** with route groups and dynamic pages for movie detail and watch flows.
- **Layered data access**: API contracts (`constants`) -> request wrappers (`api-requests`) -> React Query hooks (`queries`).
- **SSR + hydration pattern** using TanStack Query (`HydrationBoundary`, `dehydrate`) for fast initial page loads.
- **Centralized auth/network handling** in HTTP utilities with token refresh and cookie synchronization.
- **Modern UI system** with Tailwind CSS v4, reusable components, Radix primitives, and Vidstack-based media player.

## Main Features

- Browse movies by categories, countries, people, and curated collections.
- View movie details and watch pages using a `slug.id` URL convention.
- User account experience: profile, favorites, playlists, watch history, notifications.
- Auth flows: login, register, forgot password, OTP verification, social callback support.
- Responsive design and reusable component-driven UI.

## Core Stack

- **Framework**: `next`, `react`, `react-dom`
- **Language**: `TypeScript`
- **Data**: `@tanstack/react-query`, `axios`
- **State**: `zustand`
- **Forms/Validation**: `react-hook-form`, `zod`
- **Styling**: `tailwindcss` v4, `tw-animate-css`
- **Player**: `@vidstack/react`, `hls.js`

## Directory Overview

```text
src/
  app/                # App Router pages, layouts, and API routes
  api-requests/       # Domain-based request modules
  queries/            # React Query hooks and query logic
  components/         # Shared UI, app features, providers, player components
  store/              # Zustand stores
  constants/          # API endpoints, query keys, global constants
  utils/              # HTTP client, helpers, shared utilities
  routes/             # Route definitions/helpers
  types/              # Shared TypeScript types
```

## Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Create `.env.local` and set:

```env
NEXT_PUBLIC_NODE_ENV=
NEXT_PUBLIC_AUTH_API_URL=
NEXT_PUBLIC_API_ENDPOINT_URL=
NEXT_PUBLIC_API_MEDIA_URL=
NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_TINYMCE_URL=
NEXT_PUBLIC_APP_USERNAME=
NEXT_PUBLIC_APP_PASSWORD=
NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN=
NEXT_PUBLIC_MEDIA_HOST=
NEXT_PUBLIC_ACCESS_KEY=
NEXT_PUBLIC_CLIENT_TYPE=
```

> Environment variables are validated in `src/config.ts`. Invalid or missing values fail startup/build.

3. Start development server:

```bash
yarn dev
```

Open `http://localhost:3000`.

## Scripts

- `yarn dev` - start dev server (port 3000, Turbopack)
- `yarn clean-dev` - clear `.next` and start dev server
- `yarn build` - build production bundle
- `yarn start` - run production server
- `yarn lint` - run ESLint
- `yarn format` - run Prettier

## License

MIT
