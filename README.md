# MovieHub Frontend

MovieHub Frontend is a modern movie streaming web application built with Next.js App Router.  
It provides discovery, browsing, and watching experiences for movies and series, plus user-focused features such as favorites, playlists, watch history, reviews, and comments.

## Highlights

- Built with `Next.js 16`, `React 19`, and `TypeScript`
- App Router architecture with route-level metadata and static params for movie/watch pages
- Server + client data fetching with `@tanstack/react-query` hydration
- Authentication flows: login, register, forgot password, OTP verification, Google callback
- Token lifecycle handling with automatic refresh and cookie/local storage synchronization
- Personalized user areas: profile, change password, favorites, playlist, watch history, notifications
- Video watching experience with dedicated player components and watch controls
- UI stack based on `Tailwind CSS v4`, Radix UI primitives, and reusable app components

## Core Tech Stack

- Framework: `next`, `react`, `react-dom`
- Language: `TypeScript`
- Styling: `tailwindcss`, `tw-animate-css`, custom CSS modules/files
- Data fetching/caching: `@tanstack/react-query`, `axios`
- State management: `zustand`
- Forms/validation: `react-hook-form`, `zod`
- Media/player: `@vidstack/react`, `hls.js`

## Project Structure

```text
src/
  app/                # App Router pages, layouts, API routes
  api-requests/       # API request modules per domain
  queries/            # React Query hooks and query abstractions
  components/         # Shared UI, app widgets, providers, video player
  store/              # Zustand stores
  utils/              # HTTP client, storage, device, text/time helpers
  constants/          # API config, keys, shared constants
  routes/             # Typed route definitions
  types/              # Shared TypeScript types
```

## Getting Started

### 1) Install dependencies

```bash
yarn install
```

Or use:

```bash
npm install
pnpm install
```

### 2) Configure environment variables

Create a `.env.local` file in the project root and provide:

```env
NEXT_PUBLIC_API_META_ENDPOINT_URL=
NEXT_PUBLIC_NODE_ENV=
NEXT_PUBLIC_API_ENDPOINT_URL=
NEXT_PUBLIC_API_MEDIA_ENDPOINT_URL=
NEXT_PUBLIC_TENANT_ID=
NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_TINYMCE_URL=
NEXT_PUBLIC_APP_USERNAME=
NEXT_PUBLIC_APP_PASSWORD=
NEXT_PUBLIC_GRANT_TYPE_REFRESH_TOKEN=
NEXT_PUBLIC_MEDIA_HOST=
NEXT_PUBLIC_ACCESS_KEY=
NEXT_PUBLIC_CLIENT_TYPE=
```

> These variables are validated at startup in `src/config.ts`. Invalid/missing values will fail startup.

### 3) Run development server

```bash
yarn dev
```

Open `http://localhost:3000`.

## Available Scripts

- `yarn dev` - start development server on port `3000` (Turbopack)
- `yarn clean-dev` - remove `.next` and start dev server
- `yarn build` - create production build
- `yarn start` - run production server
- `yarn lint` - run ESLint
- `yarn format` - run Prettier formatting

## Authentication and Access Notes

- Route guarding is handled through `src/proxy.ts`
- `/user/*` and `/account/*` require a valid access token cookie
- Server API routes under `src/app/api/auth/*` are used to set/remove auth cookies

## License

MIT
